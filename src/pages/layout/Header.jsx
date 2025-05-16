import { useSelector } from 'react-redux';

export default function Header(){
const user = useSelector(state => state.user);
    return(
        <div className="flex flex-col h-[50px] bg-stone-300 items-center justify-center border-b-1 border-b-stone-500/60">
            <div className="md:ml-auto pe-3">
                {user.institutions?.[0]?.title}
            </div>
        </div>
    );
};