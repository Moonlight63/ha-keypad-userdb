# Home Assistant Keypad Database Addon

This is a very very basic addon that contains a webapp and sql for creating and managing credentials

## Installation

For the time being, this addon only supports 64 bit. I know this is going to be a problem for
some running homeassistant on rpi 3. Unfortunatly, I did not realize that prisma did not have
precompiled binaries for anything other than 64 bit, so I need to compile it myself.

Install the addon by adding the following repository URL to your Home Assistant addon store:

```bash
https://github.com/Moonlight63/ha-keypad-userdb.git
```

Once the addon is installed, make sure to start it and check Add to Sidebar, then navigate to its web app
by clicking on the addon from the Home Assistant sidebar.

In the web app, you can add, edit, and delete users as well as their access codes.

To use the addon with esphome, add the following YAML code to your esphome configuration:

```yaml
# Example configuration entry
wiegand:
  - id: mykeypad
    d0: GPIO22
    d1: GPIO23
    on_tag:
      - if:
          condition:
            lambda: |-
              return x.length() > 6;
          then:
            - homeassistant.event:
                event: esphome.keypaddb.getTag
                data:
                  code: !lambda "return x.c_str();"
          else:
            - homeassistant.event:
                event: esphome.keypaddb.getPrint
                data:
                  code: !lambda "return x.c_str();"

key_collector:
  - id: pincode_reader
    source_id: mykeypad
    min_length: 4
    max_length: 4
    end_key_required: false
    allowed_keys: "0123456789"
    timeout: 5s
    on_result:
      - homeassistant.event:
          event: esphome.keypaddb.getPin
          data:
            code: !lambda "return x.c_str();"
    on_timeout:
      - logger.log:
          format: "input timeout: '%s', started by '%c'"
          args: ["x.c_str()", "(start == 0 ? '~' : start)"]
```

Where GPIO22,23 are connected to your keypad, 6 is the length of your
fingerprint id code (see configuration options below), and 4 is the
length of your pin codes.

## Configuration

**Note**: _Remember to restart the add-on when the configuration is changed._

Example add-on configuration:

```yaml
pin_length: 4
print_length: 6
rfid_length: 8
```

**Note**: _This is just an example, don't copy and paste it! Create your own!_

### Option: `pin_length`

Changes the expected length of pin code entries. Changing this will affect the
user interface of the addon, as well as change how the pin codes are stored and searched.

### Option: `print_length`

Changes the expected length of fingerprint id entries. Changing this will affect the
user interface of the addon, as well as change how fingerprint IDs are stored and searched.

This value should not be equal to rfid_length, as most weigand keypads send fingerprints as
rfid tag signals. We use the returned length of the scanned tag value to determin if it is a
fingerprint scan or an rfid tag scan.

### Option: `rfid_length`

Changes the expected length of rfid tag entries. Changing this will affect the
user interface of the addon, as well as change how rfid tags are stored and searched.

This value should not be equal to print_length, as most weigand keypads send fingerprints as
rfid tag signals. We use the returned length of the scanned tag value to determin if it is a
fingerprint scan or an rfid tag scan.

### Option: `ssl`

#### Currently Unused

Enables/Disables SSL (HTTPS) on the add-on. Set it `true` to enable it,
`false` otherwise.

**Note**: _The SSL settings only apply to direct access and has no effect
on the Ingress service._

### Option: `certfile`

#### Currently Unused

The certificate file to use for SSL.

**Note**: _The file MUST be stored in `/ssl/`, which is the default_

### Option: `keyfile`

#### Currently Unused

The private key file to use for SSL.

**Note**: _The file MUST be stored in `/ssl/`, which is the default_

### Option: `leave_front_door_open`

#### Currently Unused

Adding this option to the add-on configuration allows you to disable
authentication on the AdGuard Home by setting it to `true`.

**Note**: _We STRONGLY suggest, not to use this, even if this add-on is
only exposed to your internal network. USE AT YOUR OWN RISK!_

## Encryption Settings (Advanced Usage)

Adguard allows the configuration of running DNS-over-HTTPS and DNS-over-
TLS locally. If you configure these options please ensure to restart the
addon afterwards. Also to use DNS-over-HTTPS correctly please ensure to
configure SSL on the addon as well as in Adguard itself. Also consider
that the addon and Adguard cannot use the same port for SSL.

## Changelog & Releases

This repository keeps a change log using [GitHub's releases][releases]
functionality.

Releases are based on [Semantic Versioning][semver], and use the format
of `MAJOR.MINOR.PATCH`. In a nutshell, the version will be incremented
based on the following:

- `MAJOR`: Incompatible or major changes.
- `MINOR`: Backwards-compatible new features and enhancements.
- `PATCH`: Backwards-compatible bugfixes and package updates.

## Support

Got questions?

You have several options to get them answered:

- The [Home Assistant Community Add-ons Discord chat server][discord] for add-on
  support and feature requests.
- The [Home Assistant Discord chat server][discord-ha] for general Home
  Assistant discussions and questions.
- The Home Assistant [Community Forum][forum].
- Join the [Reddit subreddit][reddit] in [/r/homeassistant][reddit]

You could also [open an issue here][issue] GitHub.

## Authors & contributors

For a full list of all authors and contributors,
check [the contributor's page][contributors].

## License

MIT License

Copyright (c) 2022-2023 Dalen Catt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
