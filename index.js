'use strict';

var _ = require('lodash'),
    gulp = require('gulp'),
    shell = require('gulp-shell'),
    gutil = require('gulp-util'),
    fileExists = require('file-exists'),
    file = require('gulp-file');

require('es6-promise').polyfill();

var PLUGIN_NAME = 'config-transform';

function setup(options) {
    if (!options.msBuildPath) {
        if (options.netVersion != '4' && options.netVersion != '2')
            throw new gutil.PluginError(PLUGIN_NAME, 'Option "netVersion" is required and must be "2" or "4".');

        if (options.framework != 'x64' && options.netVersion != 'x86')
            throw new gutil.PluginError(PLUGIN_NAME, 'Option "framework" is required and must be "x86" or "x64".');

        if (options.netVersion == 4) {
            if (options.framework == 'x64') {
                options.msBuildPath = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\msbuild.exe'
            } else if (options.framework == 'x86') {
                options.msBuildPath = 'C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\msbuild.exe'
            }
        } else if (options.netVersion == 2) {
            if (options.framework == 'x64') {
                options.msBuildPath = 'C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727\\msbuild.exe'
            } else if (options.framework == 'x86') {
                options.msBuildPath = 'C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727\\msbuild.exe'
            }
        }
    }

    if (!fileExists(options.msBuildPath))
        throw new gutil.PluginError(PLUGIN_NAME, 'MSBuild at path: "' + options.msBuildPath + '" does not exist.');

    if (!options.assemblyFile) {
        if (fileExists('C:\\Program Files (x86)\\MSBuild\\Microsoft\\VisualStudio\\v10.0\\Web\\Microsoft.Web.Publishing.Tasks.dll'))
            options.assemblyFile = 'C:\\Program Files (x86)\\MSBuild\\Microsoft\\VisualStudio\\v10.0\\Web\\Microsoft.Web.Publishing.Tasks.dll';
        else if (fileExists('C:\\Program Files (x86)\\MSBuild\\Microsoft\\VisualStudio\\v12.0\\Web\\Microsoft.Web.Publishing.Tasks.dll'))
            options.assemblyFile = 'C:\\Program Files (x86)\\MSBuild\\Microsoft\\VisualStudio\\v12.0\\Web\\Microsoft.Web.Publishing.Tasks.dll';
        else if (fileExists('C:\\Program Files (x86)\\MSBuild\\Microsoft\\VisualStudio\\v14.0\\Web\\Microsoft.Web.Publishing.Tasks.dll'))
            options.assemblyFile = 'C:\\Program Files (x86)\\MSBuild\\Microsoft\\VisualStudio\\v14.0\\Web\\Microsoft.Web.Publishing.Tasks.dll';
        else if (fileExists('C:\\Program Files (x86)\\MSBuild\\Microsoft\\VisualStudio\\v15.0\\Web\\Microsoft.Web.Publishing.Tasks.dll'))
            options.assemblyFile = 'C:\\Program Files (x86)\\MSBuild\\Microsoft\\VisualStudio\\v15.0\\Web\\Microsoft.Web.Publishing.Tasks.dll';
        else if (fileExists('C:\\Program Files)\\MSBuild\\Microsoft\\VisualStudio\\v10.0\\Web\\Microsoft.Web.Publishing.Tasks.dll'))
            options.assemblyFile = 'C:\\Program Files\\MSBuild\\Microsoft\\VisualStudio\\v10.0\\Web\\Microsoft.Web.Publishing.Tasks.dll';
        else if (fileExists('C:\\Program Files\\MSBuild\\Microsoft\\VisualStudio\\v12.0\\Web\\Microsoft.Web.Publishing.Tasks.dll'))
            options.assemblyFile = 'C:\\Program Files\\MSBuild\\Microsoft\\VisualStudio\\v12.0\\Web\\Microsoft.Web.Publishing.Tasks.dll';
        else if (fileExists('C:\\Program Files\\MSBuild\\Microsoft\\VisualStudio\\v14.0\\Web\\Microsoft.Web.Publishing.Tasks.dll'))
            options.assemblyFile = 'C:\\Program Files\\MSBuild\\Microsoft\\VisualStudio\\v14.0\\Web\\Microsoft.Web.Publishing.Tasks.dll';
        else if (fileExists('C:\\Program Files\\MSBuild\\Microsoft\\VisualStudio\\v15.0\\Web\\Microsoft.Web.Publishing.Tasks.dll'))
            options.assemblyFile = 'C:\\Program Files\\MSBuild\\Microsoft\\VisualStudio\\v15.0\\Web\\Microsoft.Web.Publishing.Tasks.dll';
        else
            throw new gutil.PluginError(PLUGIN_NAME, 'Cannot find "assemblyFile" does not exist.  Please specify the path of the "Microsoft.Web.Publishing.Tasks.dll" file.');
    } else if (!fileExists(options.assemblyFile))
        throw new gutil.PluginError(PLUGIN_NAME, 'AssemblyFile at path: "' + options.assemblyFile + '" does not exist.');

    if (!fileExists(options.config))
        throw new gutil.PluginError(PLUGIN_NAME, 'Web.config at path: "' + options.config + '" does not exist.');

    if (!fileExists(options.transform))
        throw new gutil.PluginError(PLUGIN_NAME, 'Transform file at path: "' + options.transform + '" does not exist.');
}

function createProj(options) {

    var _project = '<Project ToolsVersion="4.0" DefaultTargets="Demo" xmlns="http://schemas.microsoft.com/developer/msbuild/2003"><UsingTask TaskName="TransformXml" AssemblyFile="{assemblyFile}"/><Target Name="Transform"><TransformXml Source="{source}" Transform="{transform}" Destination="{destination}"/></Target></Project>';


    _project = _project.replace('{assemblyFile}', options.assemblyFile)
                       .replace('{source}', options.config)
                       .replace('{transform}', options.transform)
                       .replace('{destination}', options.destination);

    return Promise.all([
        new Promise(function(resolve, reject) {
            file('_msbuild.proj', _project, { src: true })
                .pipe(gulp.dest('.'))
                .on('end', resolve)
        })
    ]);
}

function transform(options) {

    options = _.extend({
        config: './web.config',
        transform: 'web.Debug.Config',
        destination: './wwwroot/web.config',
        netVersion: '4',
        framework: 'x64',
        msBuildPath: undefined,
        assemblyFile: undefined
    }, options);


    setup(options);

    return createProj(options).then(function() {
        return gulp.task('transform', shell.task(options.msBuildPath + ' ./_msbuild.proj /t:Transform'));
    });
}

module.exports = transform;