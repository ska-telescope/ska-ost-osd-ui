SKAO OSO Observation Execution Tool
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


The Observation Execution Tool UI (OET UI) is  a web Interface towards a Scheduling tool MVP which is a user-friendly UI for selection and execution of an SBD on a specific subarray.

For instructions on developing the OET UI, see the `README <https://gitlab.com/ska-telescope/oso/ska-ost-osd-ui/-/blob/main/README.md>`_

A REST layer makes the Python API for the script execution engine available
via REST over HTTP. This project also contains a command line client to allow
users to submit script execution requests to a remote OET backend.

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
