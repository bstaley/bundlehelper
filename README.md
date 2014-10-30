# Bundle Folder Helper

###Summary
In combo with WE this prebuild routine will make sure all of your files are bundled.

###How to install it

`npm install git://github.com/bstaley/bundlehelper.git `
######--or--
`npm install bundlehelper`

###How to run
1. type `bundlehelper` with a `-root <directory>` and `-bundleLoc <folder where .bundles live>`.

#####note: root search will recursively search through all folders.

###Acceptable commands
* `-root <directory where your project lives $(ProjectDir)>`
* `-bundleLoc <folder where .bundle files live>`
* `-dialog (default:false) <will prompt with questions>`
* `-autoSync (default:false) <will automatically update your bundles with missing files>`
* `-split (default:\r\n) <how the bundle files should be split by line>`

#####visual studio example: bundlehelper -root "$(ProjectDir)\" -bundleLoc CDNBundles\ -autoSync
#####node example: bundlehelper -root "c:\myfolder\myproject\\" -bundleLoc CDNBundles\ -dialog

#####note for the above examples: you need to escape the trailing '\' in a path
