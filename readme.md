[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

# bwpreview

Utility for generating preview images of StarCraft: Brood War and Remastered maps (`.scm` and `.scx` files).

All of the actual work of parsing map files and generating the images is done by the [scm-extractor](https://github.com/ShieldBattery/scm-extractor) and [bw-chk](https://github.com/ShieldBattery/bw-chk) libraries made by [the ShieldBattery project](https://shieldbattery.net/). To make it work, you need the required tileset, sprite and unit graphics from StarCraft.

<p align="center"><img align="center" src="resources/Eclipse 1.2 [preview].avif" alt="Example image (Eclipse 1.2)" width="657"></p>

This script is designed around two common use cases: generating lossless, full-size PNG images of maps, and generating smaller AVIF preview files for use on the web.

## Usage

After installation, see `bwpreview --help` for usage information:

```
usage: bwpreview [-h] [-v] [-d PATH] [-m] [-f] [-q] [--preset NAME] [--suffix STR]
                 [--type TYPE] [--size PX] [--skip-existing] [--skip-obs]
                 [--rel-path PATH] [--out-path PATH] [--gfx-path PATH] [FILE ...]

Utility for generating preview images of StarCraft: Brood War and Remastered maps.

positional arguments:
  FILE                 StarCraft map files (.scm, .scx) to generate images for

optional arguments:
  -h, --help           show this help message and exit
  -v, --version        show program's version number and exit
  -d PATH, --dir PATH  directory containing StarCraft map files to process
  -m, --map-name       use map name, not filename, to determine output filename
  -f, --flatten        flatten output directory structure
  -q, --quiet          no output except for errors
  --preset NAME        generation preset to use ("preview", "full"); sets --suffix, --type, --size
  --suffix STR         suffix string to include in the image filename
  --type TYPE          type of image to generate ("png", "jpg", "avif", "webp")
  --size PX            size in which to fit the image (e.g. 500 to make up to a 500x500 image)
  --skip-existing      skip generation when an image of the expected name already exists
  --skip-obs           skip generation of observer maps (with "(Ob)" in the name)
  --rel-path PATH      path from which to calculate relative paths (for use with -d)
  --out-path PATH      path to save image files to (if unspecified, same as map file)
  --gfx-path PATH      path where the StarCraft graphics files can be found
```

The path to the StarCraft graphics defaults to `~/.config/bwpreview`. If an output path is not specified, the images are saved to the current directory.

## Graphics

To be able to generate preview images, you'll need to extract the required graphics from StarCraft.

The following files are needed:

* all files listed in [units.js](https://github.com/ShieldBattery/bw-chk/blob/master/units.js) and [sprites.js](https://github.com/ShieldBattery/bw-chk/blob/master/sprites.js) files from [bw-chk](https://github.com/ShieldBattery/bw-chk);
* for all tilesets `['badlands', 'platform', 'install', 'ashworld', 'jungle', 'desert', 'ice', 'twilight']`, all files of extension `['.cv5', '.vx4', '.vr4', '.wpe', '.vx4ex']`.

All filenames should be lowercase, as that's how bw-chk expects them to be (although on case insensitive filesystems this doesn't matter).

## License

MIT license
