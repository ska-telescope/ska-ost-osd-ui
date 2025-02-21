SKAO OST Observatory Static Data UI
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


This project is the User Interface for the Observatory Static Data (OSD). In its simplest form OSD consists of a set of science domain configuration files that are required by the OSO tools. These configuration files hold slowly changing information that is used to configure the science domain behavior of each tool. E.g. tools such as the PPT and ODT can use the information for constructing GUIs and validating setups, the Planning Tool can use it to inform itself of the capabilities available. The idea of OSD is to provide a single source of truth for these data.

For instructions on developing the OSD UI, see the `README <https://gitlab.com/ska-telescope/ost/ska-ost-osd-ui/-/blob/main/README.md>`_

For instructions on rest api for OSD backend, see the `REST API <https://developer.skao.int/projects/ska-ost-osd/en/latest/api/osd/guide.html#endpoints>`_



.. figure:: /images/osoWorkFlow.jpg
   :width: 100%
   :align: center
   :alt: Image of OSO Work Flow

|

.. toctree::
    :maxdepth: 2
    :caption: General
    :hidden:

    Overview.rst

.. toctree::
   :maxdepth: 2
   :caption: DEPLOYING AND CONFIGURING
   :hidden:
   
   
   DuringDevelopment
   RunningBuilding
   deployment_to_kubernetes.rst
   



.. toctree::
   :maxdepth: 2
   :caption: User Guide
   :hidden:

   OSDBackground
   HowTo
   UserQuestions
   UserTroubleShooting

   
.. toctree::
   :maxdepth: 2
   :caption: Application Internals/Developer Docs
   :hidden:

   Requirements
   Installation
   Testing

.. toctree::
   :maxdepth: 1
   :caption: Releases
   :hidden:

   CHANGELOG.rst
