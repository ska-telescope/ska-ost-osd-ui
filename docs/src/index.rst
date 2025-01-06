SKAO OSO Shift Log Tool
~~~~~~~~~~~~~~~~~~~~~~~~~~


The Shift Log Tool (SLT) is envisioned as both an “on-line” tool, used in real-time by the operators at the two telescope sites, and as an “off-line” tool,
used at any of the three SKA sites. Its intention is to collate and then provide access to a record of the major events occurring during an operator’s shift.

For instructions on developing the SLT UI, see the `README <https://gitlab.com/ska-telescope/oso/ska-oso-slt-ui/-/blob/main/README.md>`_

It communicates with ska-oso-slt-services via a REST API
see the `REST API <https://developer.skao.int/projects/ska-oso-slt-services/en/latest/restapi.html>`_

.. admonition:: REACT_APP_USE_LOCAL_DATA
    
    This is an option to turn on/off the API call and instead use mocked data.


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

   SLTBackground
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
