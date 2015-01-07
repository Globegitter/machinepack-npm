module.exports = {

  friendlyName: 'Parse package.json',

  description: 'Parse metadata for the latest version of the NPM package given a package.json object.',

  extendedDescription: '',

  inputs: {
    json: {
      typeclass: 'dictionary',
      description: 'The package.json string for the NPM package.',
      required: true
    }
  },

  defaultExit: 'success',

  exits: {
    success: {
      example: {
        name: 'browserify',
        description: 'asg',
        version: '0.1.1',
        keywords: ['machine'],
        author: {
          name: 'Mike McNeil'
        },
        dependencies: [{
          name: 'lodash',
          semverRange: '^2.4.1'
        }],
        license: 'MIT'
      }
    },
    invalid: {
      description: 'NPM package is in an invalid format.'
    },
    error: {
      description: 'Unexpected error occurred.'
    },
  },

  fn: function (inputs,exits) {

    var util = require('util');
    var _ = require('lodash');

    var moduleMetadata = {};
    var _data = inputs.json;

    try {
      // Include basic metadata
      moduleMetadata.name = _data._id;
      moduleMetadata.description = _data.description;
      moduleMetadata.keywords = _data.keywords;
      moduleMetadata.version = _data['dist-tags'].latest;
      moduleMetadata.latestVersionPublishedAt = _data.time.modified;
      moduleMetadata.author = _data.author;
      moduleMetadata.license = _data.license;

      // Include the metadata about the latest version
      var latestVersion = _data.versions[moduleMetadata.version];
      moduleMetadata.dependencies = _.reduce(latestVersion.dependencies, function (memo, semverRange, name){
        memo.push({
          name: name,
          semverRange: semverRange
        });
        return memo;
      }, []);
    }
    catch (e) {
      return exits.invalid(e);
    }

    return exits.success(moduleMetadata);

  },

};
