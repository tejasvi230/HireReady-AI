const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const mongoose = require('mongoose');
const Session = require('../src/models/sessions');
const Question = require('../src/models/questions');
const ai = require('../src/services/aiService');
let generate, sessions, questions, sequence;
ai.generateQuestionBatch = params => generate(params);
const sessionRoutes = require('../src/routes/sessionRoutes');
let server, base;
Session.create = async body => {
  const doc = new Session(body);
  const error = doc.validateSync();
  if (error) throw error;
  doc.save = async () => doc;
  sessions.set(String(doc._id), doc);
  return doc;
};
Session.findById = id => {
  const doc = sessions.get(id) || null;
  const query = Promise.resolve(doc);
  query.populate = async () => doc && {...doc.toObject(),questions:doc.questions.map(id=>questions.get(String(id)))};
  return query;
};
Question.insertMany = async rows => rows.map(row => {
  const doc = new Question(row);
  assert.equal(doc.validateSync(), undefined);
  questions.set(String(doc._id),doc.toObject());
  return doc;
});
const batch = ({count}) => Array.from({length:count}, () => ({question:`Question ${++sequence}?`,answer:'A complete answer.',difficulty:'easy',tags:['topic']}));
const post = async (path, body) => {
  const res = await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:body && JSON.stringify(body)});
  return {status:res.status,body:await res.json()};
};
async function create() {
  const res = await post('/sessions',{title:'React preparation',jobRole:'Frontend engineer',experienceLevel:'entry',category:'technical'});
  assert.equal(res.status,201);
  return res.body._id;
}
before(async () => {
  const app=express();app.use(express.json());app.use('/sessions',sessionRoutes);
  server=app.listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  base=`http://127.0.0.1:${server.address().port}`;
});
after(async () => {server.closeAllConnections();await new Promise(resolve=>server.close(resolve));});
beforeEach(()=>{sessions=new Map();questions=new Map();sequence=0;generate=async p=>batch(p);});
test('form data creates session, generates 30 validated questions, saves and reloads them', async () => {
  const id=await create();const result=await post(`/sessions/${id}/generate`);
  assert.equal(result.status,200);assert.equal(result.body.count,30);assert.equal(result.body.partial,false);
  assert.equal(result.body.data.length,30);assert.equal(questions.size,30);
  const loaded=await (await fetch(base+`/sessions/${id}`)).json();
  assert.equal(loaded.questions.length,30);assert.equal(loaded.questions[0].category,'technical');
});
test('null and malformed items are skipped, duplicates removed, and missing slots replenished', async () => {
  let calls=0;
  generate=async p=>{calls++;const rows=batch(p);return calls===1 ? [null,42,{question:'No answer'},rows[0],rows[0],...rows.slice(1)] : rows;};
  const result=await post(`/sessions/${await create()}/generate`);
  assert.equal(result.status,200);assert.equal(result.body.count,30);
  assert.equal(new Set(result.body.data.map(q=>q.question)).size,30);
});
test('invalid JSON batch is retried without losing valid later batches', async () => {
  let calls=0;generate=async p=>{if(++calls===1)throw Object.assign(new Error('invalid JSON'),{code:'AI_RESPONSE'});return batch(p);};
  const result=await post(`/sessions/${await create()}/generate`);
  assert.equal(result.status,200);assert.equal(result.body.count,30);assert.equal(calls,7);
});
test('account failure stops immediately, keeps session, and allows successful retry', async () => {
  const id=await create();let calls=0;
  generate=async()=>{calls++;throw Object.assign(new Error('Token permission missing'),{code:'AI_AUTH',status:503});};
  const failed=await post(`/sessions/${id}/generate`);
  assert.equal(failed.status,503);assert.equal(failed.body.code,'AI_AUTH');assert.equal(calls,1);assert.equal(questions.size,0);
  assert.ok(sessions.has(id));generate=async p=>batch(p);
  assert.equal((await post(`/sessions/${id}/generate`)).body.count,30);
});
test('partial generation persists questions and reports actual count', async () => {
  let calls=0;generate=async p=>{if(++calls>1)throw Object.assign(new Error('Rate limited'),{code:'AI_RATE_LIMIT',status:429});return batch(p);};
  const result=await post(`/sessions/${await create()}/generate`);
  assert.equal(result.status,200);assert.equal(result.body.partial,true);assert.equal(result.body.count,5);assert.match(result.body.message,/5 of 30/);
});
test('invalid and missing session IDs do not call the AI', async () => {
  generate=()=>assert.fail('must not call AI');
  assert.equal((await post('/sessions/invalid/generate')).status,400);
  assert.equal((await post(`/sessions/${new mongoose.Types.ObjectId()}/generate`)).status,404);
});
test('concurrent retries cannot insert duplicate batches', async () => {
  const id=await create();let release, started;
  const ready=new Promise(resolve=>started=resolve);
  const waiting=new Promise(resolve=>release=resolve);
  let calls=0;generate=async p=>{if(++calls===1){started();await waiting;}return batch(p);};
  const first=post(`/sessions/${id}/generate`);await ready;
  assert.equal((await post(`/sessions/${id}/generate`)).status,409);
  release();assert.equal((await first).body.count,30);assert.equal(questions.size,30);
});
