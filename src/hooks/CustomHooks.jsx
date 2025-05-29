import { useCallback, useContext, useEffect, useState } from "react";
import { AlertContext } from "./ContextStore";
import { useSelector } from "react-redux";
import pb from "../global/pb";
import useFilterTeacher from "./useFilterTeachers";

export const useAlert = () => {
    const {setAlertSettings} = useContext(AlertContext);
    return { setAlert: setAlertSettings };
};

export const useDebounce = (func, delay) => {
    const [debouncedFunction, setDebouncedFunction] = useState(func);

    const debouncedCallback = useCallback(func, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFunction(() => debouncedCallback);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    },[func, delay]);
    return debouncedFunction;
};

export const useIsAllowedTo = (action) => {
    const { roles } = useSelector(state => state.user);
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const allowedRoles = await pb.collection("module_action_permissions").getFullList({
              filter: `action="${action}"`,
              expand: 'role',
            });
    
            if (allowedRoles.length > 0) {
              const hasRole = allowedRoles[0]?.expand?.role.some(allowedRole =>
                roles.some(userRole => userRole.title === allowedRole.title)
              );
              setIsAllowed(hasRole);
            } else {
              setIsAllowed(false); // No matching permissions, deny access
            }
          } catch (error) {
            console.error('Error fetching permissions:', error);
            setIsAllowed(false); // Handle errors gracefully, consider defaulting to denied
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchData();
      }, [action, roles]); // Dependency array includes both action and roles
    
      return { isAllowed, isLoading };
};

export {
  useFilterTeacher
};