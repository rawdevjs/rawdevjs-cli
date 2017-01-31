# rawdevjs-cli

RawDevJS command line interface.
It loads DNG files from the local file system or a http(s) URL and converts them into PNG files.

# Usage

If the package is installed global the `rawdevjs` is in the path and can be started anywhere in the files system.
Otherwise it must be called from `./node_modules/.bin/rawdevjs`.
The arguments must be given in the following format:

```
rawdevjs [options] <input-file> <output-file>
```

The input file can be a path in the local file system or a http(s) URL.
The output file can be only written to the local file system.

The following options are supported:

- `--reduce=<level>`, `-r <level>`: Shrinks the output image size to `original/(2^level)`  
