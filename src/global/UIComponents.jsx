import { useEffect, useMemo, useState } from "react";
import './components.scss';
import AutoComplete from "../components/AutoComplete/AutoComplete";
import Button from "../components/Button/Button";
import ReusableTable from "../components/Table/Table";
/**
 * TextField Components
 * @param {object} props = The component props.
 * @param {string} props.type - The type of input. Eg. text, number, date.
 * @param {label} props.label - Label for the TextField.
 * @returns 
 */
export const TextField = ({
    type = "text",
    label = "",
    className = "",
    invalid = false,
    disabled = false,
    loading = false,
    required = false,
     placeholder = "",
     ...props
    }) => {
    let _base = "px-5 py-2 text-black rounded-lg border border-gray-500 shadow-lg hover:shadow-xl active:outline-1 active:outline-offset-2 focus:outline-offset-2";
    let _invalid = "text-red border-red-500 active:outline-red-500 focus:outline-red-500";
    let _disabled = "border-0 bg-neutral-400 text-white-500";
    
    const handleStyles = () => {
        if(invalid){
            _base += " " + _invalid;
        }
        if(disabled){
            _base += " " + _disabled;
        }
        return _base;
    };
    
    return(
        <div className={`flex flex-col gap-2 px-3 md:px-0 ${className}`}>
            <p>
                {label}
                {required && <span className="text-red-500">*</span>}
            </p>
            <input
                type={type}
                className={handleStyles()}
                disabled={disabled}
                placeholder={placeholder}
                {...props}
            />
        </div>
    );
};

export const BaseContainer = ({children}) => {
    return(
        <div className="flex flex-col w-screen h-screen ">
            {children}
        </div>
    );
};

export const ParentContentContainer = ({children}) => {
    return(
        <div className="flex flex-row flex-wrap h-[100%] w-[100%]">
            {children}
        </div>
    );
};

export const ContentContainer = ({children, className, ...props}) => {
    return(
        <div className={`flex flex-col ${className}`} {...props}>
            {children}
        </div>
    );
};

export const PageHeading = ({children, title, info}) => {
    return(
        <div className="flex flex-col gap-2 lg:gap-0 lg:flex-row border border-gray-300 p-5 rounded-lg shadow-lg">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-sm font-light text-gray-400 italic">{info}</p>
            </div>
            {children}
        </div>
    );
};

export const PageContent = ({children}) => {
    return(
        <div className="flex flex-row border border-gray-300 p-5 rounded-lg shadow-lg">
            {children}
        </div>
    );
};

export const Modal = ({children, open = false}) => {
    let _base = "relative z-10";
    
    const handleStyles = () => {
        if(!open){
            _base += " " + "hidden";
        }
        return _base;
    };
    
    return(
        <div className={handleStyles()} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
            
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-full lg:max-w-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>

    );
};

export const ModalHeader = ({title}) => {
    return(
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:px-6">
            <p className="text-xl font-bold">{title}</p>
            <hr className="border-1 border-gray-500/30 mt-3 mb-5"/>
        </div>
    );
};

export const ModalContent = ({children}) => {
    return(
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {children}
        </div>
    );
};

export const ModalActions = ({children}) => {
    return(
        <div className="bg-gray-50 py-3 px-6 flex flex-row gap-3">
            {children}
        </div>
    );
};

export const TableContainer = ({children}) => {
    return(
        <div className="flex flex-col gap-3 w-full">
            {children}
        </div>
    );
};

export const TableFunctions = ({children}) => {
    return(
        <div className="flex flex-row gap-2">
            {children}
        </div>
    );
};

export const Table = ({children}) => {
    return(
        <table className="w-full border-x border-gray-300">
            {children}
        </table>
    );
};

export const SelectComponent = ({children, className, ...props}) => {
    return(
        <select className={`px-5 py-2 w-full appearance-none rounded-lg bg-transparent text-sm border border-gray-500 shadow-lg hover:shadow-xl ${className}`} {...props}>
            {children}
        </select>
    );
};

export {
    AutoComplete,
    Button,
    ReusableTable
};