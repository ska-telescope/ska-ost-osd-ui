SKA OSO Shift Log Tool (SLT) UI
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The Shift Log Tool (SLT) is one of the main tools in the OSO suite and will find use in the early AIV and commissioning phases of the telescopes. 
An early first version will allow feedback on its appearance and features before entering real use in AA0.5.

This is a initial UI flow for Shift Log Tool where user will be able to query ODA.
User will be able to search Shift by a Start Date and End Date and also by operator name.

Log Page (Home Page)
==========================================

Buttons for starting Shift and Ending Shift. also button for navigating to Shift history page.
Text entry field for comments, button for uploading media file (Images) for now.
also submit button for submitting comments and all the data.

when user will go to Home Page only ``Shift Start`` button will be enabled.

.. figure:: slt_initial_page.png
   :align: center

|

After clicking ``Shift Start`` button remaining buttons ``Shift End``, ``Submit`` and ``File Upload`` will be enabled.

.. figure:: slt_shift_end_ui.png 
   :align: center

|

User can check logs 

.. figure:: slt_home_page_logs.png 
   :align: center

|

after clicking ``Shift End`` button ``Home Page`` will be refreshed and only ``Shift Start`` button will be enabled.

.. figure:: slt_shift_end.png 
   :align: center

|

.. note::

    Log Summery section will be updated every 5 Seconds.


Shift History Page
============================================

User will be able to search Shift by a Start Date and End Date and also by operator name. after clicking search button a table with 

``Shift Start``, ``Shift End``, ``Operator Name`` and ``Source``, ``Log Message``, ``Comments`` and ``Images`` will be populated.

Initial Page
--------------

.. figure:: slt_history_page.png
   :align: center

|

After clicking search logs button
----------------------------------

.. figure:: slt_history_after_search.png
   :align: center

|

After clicking on ``Shift_ID`` new table will be open 
------------------------------------------------------

.. figure:: slt_shift_data.png
   :align: center

|

to view image(s) click on ``View Images``  
-----------------------------------------

.. figure:: slt_shift_image_page.png
   :align: center

|
