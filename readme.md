[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

# bwpreview

Utility for generating preview images of StarCraft: Brood War and Remastered maps (`.scm` and `.scx` files).

All of the actual work of parsing map files and generating the images is done by the [scm-extractor](https://github.com/ShieldBattery/scm-extractor) and [bw-chk](https://github.com/ShieldBattery/bw-chk) libraries made by [the ShieldBattery project](https://shieldbattery.net/). To make it work, you need the required tileset, sprite and unit graphics from StarCraft.

<p align="center"><img align="center" src="resources/Eclipse 1.2 [preview].avif" alt="Example image (Eclipse 1.2)" width="657"></p>

This script is designed around two common use cases: generating lossless, full-size PNG images of maps, and generating smaller AVIF preview files for use on the web.

## Installation

1. Install nodejs and npm: https://nodejs.org/en/download/
2. Run `npm install -g bwpreview .`

## Usage

After installation, see `bwpreview --help` for usage information:

```
usage: bwpreview [-h] [-v] [-d PATH [PATH ...]] [-m] [-f] [-q] [--preset NAME]
                 [--suffix STR] [--type TYPE] [--size PX] [--skip-existing]
                 [--skip-obs] [--rel-path PATH] [--out-path PATH] [--gfx-path PATH]
                 [FILE ...]

Utility for generating preview images of StarCraft: Brood War and Remastered maps.

positional arguments:
  FILE                 StarCraft map files (.scm, .scx) to generate images for

optional arguments:
  -h, --help           show this help message and exit
  -v, --version        show program's version number and exit
  -d PATH [PATH ...], --dir PATH [PATH ...]
                       directory containing StarCraft map files to process
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

### Examples

Let's say we've got a collection of maps at `~/BWmaps/`, with maps being grouped together in subdirectories.

To generate full-size images for each of them, putting the images in the same location as the original map file, we can do the following:

```
bwpreview -d . --preset full
```

Here's an example of how that works:

```
$ cd ~/BWmaps/
$ ls -l ASL\ S12/
.rwx------  87k msikma 19 Jul  2021 (4)GOOD NIGHT 1.3.scx
.rwx------ 461k msikma  5 Jul  2021 (4)Largo_1.4.scx
.rwx------  94k msikma  8 Jul  2021 (4)Lemon 0.95.scx
.rwx------  73k msikma 14 Jul  2021 (4)Revolver0.95.scx
$ ls -l BSL\ S13/
.rwxr-xr-x@  42k msikma 24 Nov  2019 (2)Heartbreak Ridge 2.1.scx
.rwxr-xr-x@  71k msikma  1 Oct  2021 (2)Vertebrae_1.33(n).scm
.rwxr-xr-x@  91k msikma  1 Oct  2021 (3)Ascension_1.0.scx
.rwxr-xr-x@  42k msikma 29 Jul  2018 (3)Aztec 2.1.scx
.rwxr-xr-x@  89k msikma  1 Oct  2021 (4)GOOD NIGHT 1.31.scx
.rwxr-xr-x@  73k msikma  1 Oct  2021 (4)Revolver1.0.scx
.rwxr-xr-x@  98k msikma  1 Oct  2021 (4)Wavelet_2.06(n).scx
$ bwpreview -d . --preset full
Generated image: ASL S12/(4)GOOD NIGHT 1.3.png (png, 4096x4096, 3155 ms, 7.88 MB)
Generated image: ASL S12/(4)Largo_1.4.png (png, 4096x4096, 3001 ms, 8.88 MB)
Generated image: ASL S12/(4)Lemon 0.95.png (png, 4096x4096, 1667 ms, 8.14 MB)
Generated image: ASL S12/(4)Revolver0.95.png (png, 4096x4096, 1496 ms, 6.39 MB)
Generated image: BSL S13/(2)Heartbreak Ridge 2.1.png (png, 4096x3072, 2994 ms, 6.22 MB)
Generated image: BSL S13/(2)Vertebrae_1.33(n).png (png, 3584x4096, 1585 ms, 8.62 MB)
Generated image: BSL S13/(3)Ascension_1.0.png (png, 4096x4096, 3651 ms, 8.42 MB)
Generated image: BSL S13/(3)Aztec 2.1.png (png, 4096x4096, 1440 ms, 8.84 MB)
Generated image: BSL S13/(4)GOOD NIGHT 1.31.png (png, 4096x4096, 1750 ms, 7.93 MB)
Generated image: BSL S13/(4)Revolver1.0.png (png, 4096x4096, 1492 ms, 6.39 MB)
Generated image: BSL S13/(4)Wavelet_2.06(n).png (png, 4096x4096, 1959 ms, 7.84 MB)
```

If we instead want just small preview files, and we want to save them all to a flat structure, we can do the following instead:

```
$ mkdir map_previews
$ bwpreview -d . --preset preview --out-path ./map_previews --flatten
Generated image: map_previews/(4)GOOD NIGHT 1.3-preview.avif (avif, 1000x1000, 1961 ms, 263.77 kB)
Generated image: map_previews/(4)Largo_1.4-preview.avif (avif, 1000x1000, 2132 ms, 304.36 kB)
Generated image: map_previews/(4)Lemon 0.95-preview.avif (avif, 1000x1000, 2009 ms, 285.33 kB)
Generated image: map_previews/(4)Revolver0.95-preview.avif (avif, 1000x1000, 1784 ms, 228.55 kB)
Generated image: map_previews/(2)Heartbreak Ridge 2.1-preview.avif (avif, 1000x750, 3479 ms, 184.5 kB)
Generated image: map_previews/(2)Vertebrae_1.33(n)-preview.avif (avif, 875x1000, 3580 ms, 311.09 kB)
Generated image: map_previews/(3)Ascension_1.0-preview.avif (avif, 1000x1000, 3889 ms, 247.8 kB)
Generated image: map_previews/(3)Aztec 2.1-preview.avif (avif, 1000x1000, 1951 ms, 264.51 kB)
Generated image: map_previews/(4)GOOD NIGHT 1.31-preview.avif (avif, 1000x1000, 3354 ms, 264.84 kB)
Generated image: map_previews/(4)Revolver1.0-preview.avif (avif, 1000x1000, 1788 ms, 228.55 kB)
Generated image: map_previews/(4)Wavelet_2.06(n)-preview.avif (avif, 1000x1000, 2582 ms, 318.27 kB)
```

Note that the generated previews are much smaller in both image size and in filesize, and that all resulting files are in the same directory as opposed to in a directory structure like before.

## Graphics

To be able to generate preview images, you'll need to extract the required graphics from StarCraft.

**[A copy of the required graphics can be found here](https://archive.org/details/StarCraftMapGraphics)** (18.4M), provided for convenience reasons.

You can also extract them from the game files directly using a program such as [CascView](http://www.zezula.net/en/casc/main.html).

The following files are needed:

* all files listed in [units.js](https://github.com/ShieldBattery/bw-chk/blob/master/units.js) and [sprites.js](https://github.com/ShieldBattery/bw-chk/blob/master/sprites.js) files from [bw-chk](https://github.com/ShieldBattery/bw-chk);
* for all tilesets `['badlands', 'platform', 'install', 'ashworld', 'jungle', 'desert', 'ice', 'twilight']`, all files of extension `['.cv5', '.vx4', '.vr4', '.wpe', '.vx4ex']`.

All filenames should be lowercase, as that's how bw-chk expects them to be (although on case insensitive filesystems this doesn't matter).

## License

MIT license
