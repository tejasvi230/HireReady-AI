const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createAiService } = require('../src/services/aiService');
const question = { question: 'How does array[0] work?', answer: 'It reads the first item.', difficulty: 'easy', tags: ['arrays'] };
const input = { jobRole: 'Frontend engineer', experienceLevel: 'entry', category: 'technical', count: 1 };
const response = content => ({ choices: [{ message: { content } }] });
const env = { HF_TOKEN: 'test-token' };

for (const [name, content] of [
  ['bare JSON', JSON.stringify([question])],
  ['fenced JSON and trailing bracketed prose', '```json\n'+JSON.stringify([question])+'\n```\n[End of response]'],
  ['object wrapper', JSON.stringify({questions:[question]})],
  ['reasoning before JSON', '<think>[ignore this]</think>'+JSON.stringify([question])],
]) {
  test('parses '+name, async () => {
    const service = createAiService({ env, client: { chatCompletion: async () => response(content) } });
    assert.deepEqual(await service.generateQuestionBatch(input), [question]);
  });
}
test('rejects incomplete or empty responses', async () => {
  for (const content of ['', '[{"question":"oops","tags":["tag"]', undefined]) {
    const service = createAiService({ env, client: { chatCompletion: async () => response(content) } });
    await assert.rejects(service.generateQuestionBatch(input), { code: 'AI_RESPONSE' });
  }
});
test('requires a token before making requests', async () => {
  const service = createAiService({ env: {}, client: { chatCompletion: () => assert.fail('must not call provider') } });
  await assert.rejects(service.generateQuestionBatch(input), { code: 'AI_CONFIG', status: 503 });
});
test('falls back from unavailable model and remembers working model', async () => {
  const calls = [];
  const service = createAiService({ env: {...env, HF_MODEL:'unavailable/model'}, client: { chatCompletion: async (params, options) => {
    calls.push(params.model);
    assert.equal(options.retry_on_error, false);
    assert.ok(options.signal instanceof AbortSignal);
    if (params.model === 'unavailable/model') throw Object.assign(new Error('provider failed'), {httpResponse:{status:400,body:{error:{code:'model_not_supported'}}}});
    return response(JSON.stringify([question]));
  } } });
  await service.generateQuestionBatch(input);
  await service.generateQuestionBatch(input);
  assert.deepEqual(calls, ['unavailable/model','meta-llama/Llama-3.1-8B-Instruct','meta-llama/Llama-3.1-8B-Instruct']);
});
for (const [status, code] of [[401,'AI_AUTH'],[403,'AI_AUTH'],[402,'AI_CREDITS'],[429,'AI_RATE_LIMIT']]) {
  test('shows actionable error for HTTP '+status+' without model retries', async () => {
    let calls = 0;
    const service = createAiService({ env, client: { chatCompletion: async () => {
      calls++;
      throw Object.assign(new Error('upstream'), { httpResponse: { status, body: 'hf_secretMustNotAppear' } });
    } } });
    await assert.rejects(service.generateQuestionBatch(input), error => error.code === code && !error.message.includes('hf_secretMustNotAppear'));
    assert.equal(calls, 1);
  });
}
test('explanation rejects empty response and trims usable response', async () => {
  let content = '   ';
  const service = createAiService({ env, client: { chatCompletion: async () => response(content) } });
  await assert.rejects(service.generateExplanation(question), {code:'AI_RESPONSE'});
  content = '  Explain the key idea.  ';
  assert.equal(await service.generateExplanation(question), 'Explain the key idea.');
});

test('recovers only complete questions from a response truncated at its final object', async () => {
  const content = '['+JSON.stringify(question)+', {"question":"incomplete","answer":"unfinished';
  const service = createAiService({ env, client: { chatCompletion: async () => response(content) } });
  assert.deepEqual(await service.generateQuestionBatch(input), [question]);
});
