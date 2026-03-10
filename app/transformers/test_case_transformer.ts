import type TestCase from '#models/test_case'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class TestCaseTransformer extends BaseTransformer<TestCase> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'uatFlowId',
      'testNo',
      'descriptionOfTasks',
      'stepsToExecute',
      'expectedResults',
      'pass',
      'fail',
      'defectComments',
      'sequence',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ])
  }
}
