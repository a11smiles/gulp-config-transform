'use strict';

var _ = require('lodash'),
    gulp = require('gulp'),
    shell = require('gulp-shell'),
    gutil = require('gulp-util'),
    fileExists = require('file-exists'),
    file = require('gulp-file');

var PLUGIN_NAME = 'config-transform';

function transform(options) {

    options = _.extend({
        config: './web.config',
        transform: 'web.Debug.Config',
        destination: './wwwroot/web.config',
        msBuildPath: 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\msbuild.exe'
    }, options);

    var _project = '<Project ToolsVersion="4.0" DefaultTargets="Demo" xmlns="http://schemas.microsoft.com/developer/msbuild/2003"><UsingTask TaskName="TransformXml" AssemblyFile="$(MSBuildExtensionsPath)\\Microsoft\\VisualStudio\\v10.0\\Web\\Microsoft.Web.Publishing.Tasks.dll"/><Target Name="Transform"><TransformXml Source="{source}" Transform="{transform}" Destination="{destination}"/></Target></Project>';

    if (!fileExists(options.config))
        throw new gutil.PluginError(PLUGIN_NAME, '"' + options.config + '" does not exist.');

    if (!fileExists(options.transform))
        throw new gutil.PluginError(PLUGIN_NAME, '"' + options.transform + '" does not exist.');

    _project = _project.replace('{source}', options.config)
                       .replace('{transform}', options.transform)
                       .replace('{destination}', options.destination);

    file('_msbuild.proj', _project, { src : true }).pipe(gulp.dest('.'));

    return gulp.task('transform', shell.task(options.msBuildPath + ' ./_msbuild.proj /t:Transform'));
}

module.exports = transform;