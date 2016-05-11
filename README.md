# gulp-config-transform

[![Build status](https://ci.appveyor.com/api/projects/status/jmewfgra4pcnam0n?svg=true)](https://ci.appveyor.com/project/a11smiles/gulp-config-transform)

A gulp plugin to apply `web.config` transforms. You can use this plugin for using gulp with Visual Studio solutions to produce various configurations. This is especially useful when upgrading legacy web applications to ASP.NET 5 since the `web.config` isn't natively supported. 

## Transformations While Debugging Locally
Legacy applications that rely on `web.config` transformations often use Visual Studio plugins like [SlowCheetah](https://visualstudiogallery.msdn.microsoft.com/69023d00-a4f9-4a34-a6cd-7e854ba318b5) and [Fast Koala](https://visualstudiogallery.msdn.microsoft.com/7bc82ddf-e51b-4bb4-942f-d76526a922a0) to perform transforms in the development environment because MSBuild only transforms the `web.config` upon deployment, not debugging.

## Changes in ASP.NET 5
With ASP.NET 5 applications, the `web.config` has been deprecated and _should_ only contain a registration for a request handler to make the ASP.NET application backwards compatible on IIS.  All remaining configuration settings should be handled by JSON configuration files and with middleware registered in the _StartUp_ class.

Additionally, ASP.NET is no longer compiled by MSBuild, but, rather, the new .NET Execution environment (DNX).  With this change, MSBuild targets files (.csproj, .vbproj) are no longer needed.

Unfortunately, while migrating legacy applications to ASP.NET 5, the `web.config` and its transformations may still be necessary.  But, without targets files, utilities like SlowCheetah and Fast Koala become obsolete.  Visual Studio 2015 relies on Gulp tasks to handle any pre- and post- build steps.  By using _gulp-config-transform_, you can perform the necessary config transformations for both, debug and production, environments.

## Installation
Install the package with NPM and add it to your development dependencies.  
`npm install gulp-config-transform --save-dev`

## Usage
```
var config-transform = require('gulp-config-transform');

gulp.task('transform', function() {
    var options = { transform : 'Web.Debug.config' }
	
    config-transform(options);	
});

```

## Options
* `config`  
  The path of the `web.config`.  
  _Default_: `./web.config`  
  
* `transform`  
  The path of the transformation configuration.  
  _Default_: `./web.Debug.config`  
  
* `destination`  
  The output path of the transformed `web.config`.  
  _Default_: `./wwwroot/web.config`  
  
* `netVersion`  
  The version of MSBuild. Accepted values are '4' or '2'.  
  _Default_: `4`    
  
* `framework`  
  The target framework for the build.  Accepted values are 'x86' or 'x64'.  
  _Default_: `x64`  
  
* `msBuildPath`  
  The full path to the MSBuild executable in order to perform the transform.  The path is determined based on the `netVersion` and `framework` options.  However, if an alternative path is specified, that path will be used instead.  
  _Default_: _resolved based on `netVersion` and `framework`_
 
* `assemblyFile`  
  The path of the assembly file for MSBuild to use in order to conduct the web transformation targets.  The path is attempted to be resolved automatically by the plugin.  But, if it cannot be found or you would like to specify an alternative path, you will need to specify the path as an option.  
  The default to this path depends on the current .NET SDK (which is also included with Visual Studio) that is installed on your machine, but the path is _typically_ something like: 
  ```
  C:\Program Files (x86)\MSBuild\Microsoft\VisualStudio\v10.0\Web\Microsoft.Web.Publishing.Tasks.dll
  ```  
  The `v10.0` can range from `v10.0-v15.0`.     
  _Default_: _resolved automatically_  
  
  ## Known Issues / Workarounds
  If a transformed configuration file is not created and no error is thrown try running the gulp command as an Administrator.
  