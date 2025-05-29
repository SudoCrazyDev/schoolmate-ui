const Button = (
    {
        children,
        type = "submit",
        disabled = false,
        fullwidth = false,
        loading = false,
        className = "",
        ...props
    }) => {
    let _base = "px-2 py-2 text-white rounded-sm cursor-pointer shadow-lg hover:shadow-xl active:outline-2 focus:outline-offset-2 flex flex-row justify-center";
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
        <div className="px-5 md:px-0 flex flex-col">
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
export default Button;