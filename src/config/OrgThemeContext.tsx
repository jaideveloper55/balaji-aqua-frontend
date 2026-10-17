import { createContext, useContext } from "react";
import { getOrgConfig, type OrgConfig } from "./orgConfig";

// WHY a context: it works like a "global variable" for React components.
// The layout sets the active org config ONCE, and any page or component
// below it can read the theme without receiving it as a prop.

// Default value = water plant config. If a component is ever rendered
// outside the provider, it still works instead of crashing.
const OrgConfigContext = createContext<OrgConfig>(getOrgConfig());

// The layout wraps its children with this:
//   <OrgConfigProvider value={config}> ... </OrgConfigProvider>
export const OrgConfigProvider = OrgConfigContext.Provider;

// Pages and components call this hook to read the active org config:
//   const { theme } = useOrgConfig();
export const useOrgConfig = () => useContext(OrgConfigContext);
