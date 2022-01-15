EMC Tutorial
============

This guide will walk you through the usage of EMC.

## How to run
Once installed, you can run in at any time by opening a terminal/command prompt and entering `emc`. By default, EMC will look for a file in that directory called 'index.emli', and will output the compiled file in that directory as 'index.html'.

## Options
If you want to run EMC on a file in a different directory, or not called 'index.emli', then the options are for you.

EMC's options follow the format:
```
emc <emli file name> <html file name>
```
In that specific order. If you want to change the positions of the arguments, you can use Named Flags:
```
emc --file=<emli file name> --out<html file name>
```
```
emc --out<html file name> --file=<emli file name>
```

Both of the above are valid.
