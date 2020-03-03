/**
 * Auth config module.
 *
 * @see https://mongoosejs.com/docs/lambda.html
 *
 * @module configs/auth
 */

const config = new Map();

config.set('model', 'user');
config.set('pipeline', [
  {
    $match: {
      disabledAt: null
    }
  },
  {
    $lookup: {
      from: 'organizations',
      localField: 'organization',
      foreignField: '_id',
      as: 'organization'
    }
  },
  {
    $addFields: {
      organization: {
        $arrayElemAt: ['$organization', 0]
      }
    }
  },
  {
    $lookup: {
      from: 'groups',
      localField: '_id',
      foreignField: 'members.user',
      as: 'groups'
    }
  },
  {
    $project: {
      _id: true,
      department: true,
      firstname: true,
      lastname: true,
      roles: true,
      organization: {
        _id: true,
        name: true
      },
      groups: {
        $reduce: {
          input: '$groups',
          initialValue: [],
          in: {
            $concatArrays: ['$$value', ['$$this._id']]
          }
        }
      }
    }
  }
]);

export default config;
