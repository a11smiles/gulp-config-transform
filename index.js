'use strict';

var _ = require('lodash'),
    shell = require('gulp-shell'),
    gutil = require('gulp-util'),
    fileExists = require('file-exists');

var PLUGIN_NAME = 'config-transform';

function transform(options) {

    options = _.extend({
        config: './Web.config',
        transform: 'Web.Debug.Config',
        destination: './wwwroot/web.config',
        msBuildPath: 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\msbuild.exe'
    }, options);

    var _project = '<Project ToolsVersion="4.0" DefaultTargets="Demo" xmlns="http://schemas.microsoft.com/developer/msbuild/2003"><UsingTask TaskName="TransformXml" AssemblyFile="$(MSBuildExtensionsPath)\Microsoft\VisualStudio\v10.0\Web\Microsoft.Web.Publishing.Tasks.dll"/><Target Name="Transform"><TransformXml Source="{source}" Transform="{transform}" Destination="{destination}"/></Target></Project>';

    if (!fileExists(options.config))
        throw new gutil.PluginError(PLUGIN_NAME, '"' + options.config + '" does not exist.');

    if (!fileExists(options.transform))
        throw new gutil.PluginError(PLUGIN_NAME, '"' + options.transform + '" does not exist.');

    _project.replace('{source}', options.config);
    _project.replace('{transform}', options.transform);
    _project.replace('{destination}', options.destination);

    return shell.task()
}

module.exports = transform;