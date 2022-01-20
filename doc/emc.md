EMC Tutorial
============

**EMC**: The **EM**LI **C**ompiler.
<br>
This guide will walk you through the installation and usage of EMC.

## How to Install
To install EMC you first need to have [deno](https://deno.land) installed on your system. You can do this by visiting their website and running the appropriate script for your system.

You then need to run `deno install --allow-read --allow-write -n emc https://cdn.jsdelivr.net/gh/ThatBlockyPenguin/WSS-EMLI@v0.1.0-alpha.4/mod.ts` to install EMC.

If you ever wish to uninstall EMC, just run `deno uninstall emc`.

To update EMC, simply uninstall it, then install it again.

## How to run
Once installed, you can run in at any time by opening a terminal/command prompt and entering `emc`. By default, EMC will look for a file in that directory called 'index.emli', and will output the compiled file in that directory as '&lt;inputted file name&gt;.html'.

## Options
If you want to run EMC on a file in a different directory, or not called 'index.emli', then the options are for you.

EMC's options follow the format:
```
emc <emli file name> <html file name>
```
In that specific order. If you want to change the positions of the arguments, you can use Named Flags:
```
emc --file=<emli file name> --out=<html file name>
```
```
emc --out=<html file name> --file=<emli file name>
```

Both of the above are valid.

You can also run EMC on every EMLI file in a directory. For example:
```
emc .
```
or
```
emc --file=.
```
will run EMC on every '\*.emli' file in the current directory. When doing this, the `out` argument is ignored, and each file is saved as '&lt;name of emli file&gt;.html'
