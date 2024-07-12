<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Initial spec and project planning

https://pad.dyne.org/code/#/2/code/view/tv2svs0FVvcW3LdnqzTS5ekwu7ZD6uYTOpD0rorWxlM/

# Repo

https://github.com/dyne/signroom

# Reasearch

after a long journey about a lot of different implementation the choice is
toward the official **Digital Signature Service** - DSS that offers an
open-source software library for electronic signature creation and validation.
DSS supports the creation and verification of interoperable and secure
electronic signatures in line with European legislation. In particular, DSS
aims to follow the eIDAS Regulation and related standards closely.

**NO NEED for CRYPTO development** as is already everything
is bundled in a ready made service that can be run locally (a-la-restroom like)

The ready to use webapp allows testing the different functionalities offered in
DSS without needing to dive into the implementation.

The DSS demo is available online on the
[DIGITAL website](https://ec.europa.eu/digital-building-blocks/DSS/webapp-demo/home).

The DSS demo is also available as a ready to use downloadable webapp. To use it,
you need to complete the following steps:

1. Download the webapp as a [ZIP folder](https://ec.europa.eu/digital-building-blocks/wikis/display/DIGITAL/Digital+Signature+Service+-++DSS).
2. Unzip the folder
3. Click on the Webapp-Startup.bat file
4. Wait until this message appears "Server startup in xxx ms"

## Links

* https://ec.europa.eu/digital-building-blocks/wikis/display/DIGITAL/Digital+Signature+Service+-++DSS
* https://ec.europa.eu/digital-building-blocks/DSS/webapp-demo/doc/dss-documentation.html
* https://ec.europa.eu/digital-building-blocks/DSS/webapp-demo/home
* https://ec.europa.eu/digital-building-blocks/wikis/display/DIGITAL/Digital+Signature+Service+-++DSS?preview=/467109107/467109108/Qualification%20algorithm.pdf