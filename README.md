# gulp-config-transform
A gulp plugin to apply `web.config` transforms. You can use this plugin for using gulp with Visual Studio solutions to produce various configurations. This is especially useful when upgrading legacy web applications to ASP.NET 5 since the `web.config` isn't natively supported. 

## Transformations While Debugging Locally
Legacy applications that rely on `web.config` transformations often use Visual Studio plugins like [SlowCheetah](https://visualstudiogallery.msdn.microsoft.com/69023d00-a4f9-4a34-a6cd-7e854ba318b5) and [Fast Koala](https://visualstudiogallery.msdn.microsoft.com/7bc82ddf-e51b-4bb4-942f-d76526a922a0) to perform transforms in the development environment because MSBuild only transforms the `web.config` upon deployment, not debugging.

## Changes in ASP.NET 5
With ASP.NET 5 applications, the `web.config` has been deprecated and _should_ only contain a registration for a request handler to make the ASP.NET application backwards compatible on IIS.  All remaining configuration settings should be handled by JSON configuration files and with middleware registered in the _StartUp_ class.

Additionally, ASP.NET is no longer compiled by MSBuild, but, rather, the new .NET Execution environment (DNX).  With this change, MSBuild targets files (.csproj, .vbproj) are no longer needed.

Unfortunately, while migrating legacy applications to ASP.NET 5, the `web.config` and its transformations may still be necessary.  But, without targets files, utilities like SlowCheetah and Fast Koala become obsolete.  Visual Studio 2015 relies on Gulp tasks to handle and pre- and post- build steps.  By using _gulp-config-transform_, you can perform the necessary config transformations for both, debug and production, environments.

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
  
* `msBuildPath`  
  The full path to the MSBuild executable in order to perform the transform.  
  _Default_: `C:\Windows\Microsoft.NET\Framework64\v4.0.30319\msbuild.exe`
  
## To Do's
* Add option to specify .NET version of MSBuild in the case there's preference for a different target framework.
* Add option to specify platform in the case this is being built in an x86 environment.
* Add errors.
* Add automatic build and deployment to NPM.
 