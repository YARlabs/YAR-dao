import { useEthers } from '@usedapp/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import React from 'react';
import { toast } from 'react-toastify';



const Connect = () => {
    const { activateBrowserWallet, account, isLoading } = useEthers();

    const getShortPublicKey = () => `Click to copy ${account?.substring(0, 8)}...`;

    const accountData = () => 
        account ? (
            <CopyToClipboard text={account} onCopy={() => {
                toast.success('Address coppied!', {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "colored",
                  });
            }}>
                <button className="btn btn-warning">
                    {getShortPublicKey()}
                </button>
            </CopyToClipboard>
        ) : (
            <button
                onClick={() => activateBrowserWallet()} 
                className="btn btn-warning"
            >
                Connect
            </button> 
        )

        return (
            <div className="text-end">
                {
                    (!isLoading && accountData()) || "Wait..."
                }
            </div>
        )
}

export default Connect;