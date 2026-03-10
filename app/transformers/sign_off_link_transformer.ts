import type SignOffLink from '#models/sign_off_link'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class SignOffLinkTransformer extends BaseTransformer<SignOffLink> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'signOffRecordId',
      'token',
      'signerName',
      'signerEmail',
      'status',
      'signedAt',
      'signerActualName',
      'signerComments',
      'signerIp',
      'signerUserAgent',
      'expiresAt',
      'createdAt',
      'updatedAt',
    ])
  }
}
