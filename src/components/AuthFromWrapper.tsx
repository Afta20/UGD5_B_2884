import React, {ReactNode} from "react";
interface AuthFromWrapperProps {
    title: string;
  children: ReactNode;
}

const AuthFromWrapper = ({ title, children }: AuthFromWrapperProps) => {
    return (
        <div className="w-full max-w-md bg-white rounded-xl shadowlg p-8">
            <h2 className="text-3xl font-bold mb-8 text-center textprimary">{title}</h2>
            {children}
        </div>
    );
};

export default AuthFromWrapper;