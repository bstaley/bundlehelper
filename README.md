# Bundle Helper

###Summary
In combo with WE this prebuild routine will make sure all of your files are bundled.

###Bundle file configuration

######note: these files are your .bundle files
```
<bundle ... >
  <settings>
   ...
    <sourceFolder>css/custom</sourceFolder>
  </settings>
</bundle>
```
this tells the pre-build action where all of your files for your bundle live. In this case my css files live in '(Project Directory)/css/custom/'. Each bundle that you want to auto sync you will need to add this line. Any bundle with out this line will be ignored.

######note: 'soureFolder' above does not need beginning and trailing slashes. 


###How to install it

`npm install git://github.com/bstaley/bundlehelper.git -g`
######--or--
`npm install bundlehelper -g`

###How to run
* type `bundlehelper` with a `-root <directory of your project>` and `-bundleLoc <folder where .bundles live>`.

######note: root search will recursively search through all folders.

###Acceptable commands
* `-root <directory where your project lives $(ProjectDir)>`
* `-bundleLoc <folder where .bundle files live>`
* `-dialog (default:false) <will prompt with questions>`
* `-autoSync (default:false) <will automatically update your bundles with missing files>`
* `-split (default:\r\n) <how the bundle files should be split by line>`

###Examples
* visual studio pre/post build event: `bundlehelper -root "$(ProjectDir)\" -bundleLoc CDNBundles\ -autoSync`
* node CLI: `bundlehelper -root "c:\myfolder\myproject\\" -bundleLoc CDNBundles\ -dialog`
* publish profile visual studio: 
```
<Project>
  ...
  <Target Name="BundleHelper">
    <Exec Command="bundlehelper -root &quot;$(ProjectDir)\&quot; -bundleLoc CDNBundles\ -autoSync"/>
  </Target>
  <PropertyGroup>
    <CopyAllFilesToSingleFolderForPackageDependsOn>
      BundleHelper;
      $(CopyAllFilesToSingleFolderForPackageDependsOn);
    </CopyAllFilesToSingleFolderForPackageDependsOn>

    <CopyAllFilesToSingleFolderForMsdeployDependsOn>
      BundleHelper;
      $(CopyAllFilesToSingleFolderForMsdeployDependsOn);
    </CopyAllFilesToSingleFolderForMsdeployDependsOn>
  </PropertyGroup>
</Project>
  ```
######note for the above examples: you need to escape the trailing '\' in a path
