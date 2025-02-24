During development
~~~~~~~~~~~~~~~~~~

It is note that the introduction of new libraries may throw an error. This is usually because WebPack requires the library to be included as part of the ModuleFederationPlugin entry within the webpack.config.js It is suggested that the new library be added into the area on the configuration annotated mixture.

Adjustment once final positioning within the SKAO-Portal has been determined
=============================================================================

So that there is no clashes with other applications originating from a skeleton, the following steps should be taken. Once these are done the application will no longer be available via the ReactSKeleton menu item within the SKAO-Portal

1. webpack.config.js : Change the devServer port number from 8090.
2. webpack.config.js : Change the final ReactSkeleton entry to NewApp.
3. Relate these new values back to the developer responsible for updating the SKAO-Portal

Once these steps have been completed, the application should be accessible from it's new location in the SKAO-Portal

SKAO Components
===============

These are supplied from the various components. 
An overview of the libraries have been provided here for reference.
For specifics of the components/functions available, please refer to the appropriate repository

ska-javascript-components : library containing a few pure components and types

ska-gui-components : library containing components that have been built using Material UI. 

ska-gui-local-storage : library containing redux local storage.  This is used by the ska-gui-components components as applicable

It is noted that all the components from ska-javascript are provided in addition as part of the ska-gui-components library,
so separate inclusion is not required if the ska-gui-components are included.
