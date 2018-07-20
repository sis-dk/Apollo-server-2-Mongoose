/* @flow */

import { schemaComposer } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/testdb');

const ExperimentSchema = new mongoose.Schema({
  isEnabled: Boolean,
  device: {
    type: String,
    enum: [ 'all', 'desktop', 'tablet', 'mobile' ],
  },
});

const Experiment = mongoose.model('Experiment', ExperimentSchema);
const ExperimentTC = composeWithMongoose(Experiment, {});

schemaComposer.Query.addFields({
  expById: ExperimentTC.getResolver('findById'),
  expByIds: ExperimentTC.getResolver('findByIds'),
  expOne: ExperimentTC.getResolver('findOne'),
  expMany: ExperimentTC.getResolver('findMany'),
  expCount: ExperimentTC.getResolver('count'),
  expConnection: ExperimentTC.getResolver('connection'),
  expPagination: ExperimentTC.getResolver('pagination'),
  enabledExps: {
    type: '[Experiment]',
    resolve: () => new Promise((resolve, reject) => {
      Experiment.find({isEnabled: true}, (error, docs) => {
        if(error) {
          reject(error);
        } else {
          resolve(docs);
        }
      });
    })
  },
});

schemaComposer.Mutation.addFields({
  expCreate: ExperimentTC.getResolver('createOne'),
  expUpdateById: ExperimentTC.getResolver('updateById'),
  expUpdateOne: ExperimentTC.getResolver('updateOne'),
  expUpdateMany: ExperimentTC.getResolver('updateMany'),
  expRemoveById: ExperimentTC.getResolver('removeById'),
  expRemoveOne: ExperimentTC.getResolver('removeOne'),
  expRemoveMany: ExperimentTC.getResolver('removeMany'),
});

export const schema = schemaComposer.buildSchema();
