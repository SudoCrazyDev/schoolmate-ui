import { useEffect, useMemo, useState } from "react";
import './components.scss';

export const Button = ({children, type = "submit", disabled = false, fullwidth = false, loading = false, className = "", ...props}) => {
    let _base = "px-5 py-2 text-white rounded-sm cursor-pointer shadow-lg hover:shadow-xl active:outline-2 focus:outline-offset-2 flex flex-row justify-center";
    let _default = "bg-blue-500 shadow-blue-500/50 hover:bg-sky-500 active:bg-sky-700 active:outline-blue-500";
    let _cancel = "bg-red-500 shadow-red-500/50 hover:bg-orange-700 active:bg-orange-800 active:outline-red-500";
    let _disabled = "bg-neutral-500 shadow-neutral-500/50  hover:bg-neutral-500 text-zinc-300";
    let _loading = "bg-sky-600"

    const handleStyles = () => {
        if((type === 'submit' || type === 'button') && !disabled){
            _base += " " + _default;
        }
        if(type === 'cancel' && !disabled){
             _base += " " + _cancel;
        }
        if(disabled){
            _base += " " + _disabled;
        }
        if(loading){
            _base += " " + _loading;
        }
         if(fullwidth){
            _base += "w-[100%]";
        }
        return _base + " " + className;
    };

    const handleButtonType = () => {
        if(type === 'submit'){
            return 'submit';
        }
        return 'button';
    };
    
    return(
        <div className="px-3 md:px-0 flex flex-col w-[100%]">
            <button type={handleButtonType()} className={handleStyles()} {...props}>
                {loading && (
                <svg className="animate-spin  text-white-500 mr-2 size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938" />
                    </svg>
                )}
                {children}
            </button>
        </div>
    );
};

export const TextField = ({type = "text", label = "", className = "", invalid = false, disabled = false, loading = false, required = false, placeholder = "", ...props}) => {
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