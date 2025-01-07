Welcome to ska-ost-osd-ui's documentation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This project is the User Interface for the Observatory Static Data (OSD). In its simplest form OSD consists of 
a set of science domain configuration files that are required by the OSO tools. These configuration files hold 
slowly changing information that is used to configure the science domain behavior of each tool. 
E.g. tools such as the PPT and ODT can use the information for constructing GUIs and validating setups, 
the Planning Tool can use it to inform itself of the capabilities available. The idea of OSD is to provide a 
single source of truth for these data.

.. toctree::
   :maxdepth: 1
   :caption: Releases

   CHANGELOG.rst


.. toctree::
   :maxdepth: 2
   :caption: Application Internals/Developer Docs

   developer/Overview
   developer/Installation
   developer/Requirements
   developer/DuringDevelopment
   developer/RunningBuilding
   developer/Testing