import {getMetadata, Obelisk,TransactionBlock} from "@0xobelisk/client";
import {useEffect} from "react";
import {useAtom} from "jotai";
import {Value} from "../../jotai";
import { useRouter } from "next/router";
import {NETWORK, PACKAGE_ID, WORLD_ID} from "../../chain/config";
import {obeliskConfig} from "../../../obelisk.config";
import PRIVATEKEY from "../../chain/key";


type data = {
    type:string;
    fields:Record<string, any>;
    hasPublicTransfer:boolean;
    dataType:"moveObject";
}

const Home = () =>{
    const router = useRouter()
    const [value,setValue] = useAtom(Value)

    const counter = async () => {
        const metadata = await getMetadata(NETWORK, PACKAGE_ID);
        const obelisk = new Obelisk({
            networkType: NETWORK,
            packageId: PACKAGE_ID,
            metadata: metadata,
            secretKey:PRIVATEKEY
        });
        const tx = new TransactionBlock()
        const world = tx.pure(WORLD_ID)
        const params = [
            world,
        ]
        const new_tx = await obelisk.tx.counter_system.inc(tx, params,true) as TransactionBlock;
        const response = await obelisk.signAndSendTxn(
            new_tx

        )
        if (response.effects.status.status == 'success') {
            const metadata = await getMetadata(NETWORK, PACKAGE_ID);
            const obelisk = new Obelisk({
                networkType: NETWORK,
                packageId: PACKAGE_ID,
                metadata: metadata,
            });
            const component_name = Object.keys(obeliskConfig.singletonComponents)[1]
            const component_value = await obelisk.getComponentByName(WORLD_ID,component_name)
            const content = component_value.data.content as data
            const value = content.fields.value.fields.value
            setValue(value)
        }
    }



    useEffect(() => {
        if (router.isReady){
            const query_counter = async () => {
                const metadata = await getMetadata(NETWORK, PACKAGE_ID);
                const obelisk = new Obelisk({
                    networkType: NETWORK,
                    packageId: PACKAGE_ID,
                    metadata: metadata,
                });
                // counter component name
                const component_name = Object.keys(obeliskConfig.singletonComponents)[1]
                const component_value = await obelisk.getComponentByName(WORLD_ID,component_name)
                const content = component_value.data.content as data
                const value = content.fields.value.fields.value
                setValue(value)
            }
            query_counter()
        }
    }, [router.isReady]);
    return (
        <div>
            <div>
                Counter: {value}
            </div>
            <div>
                <button onClick={()=>{
                    counter()
                }}>Counter++</button>
            </div>
        </div>
    )
}

export default Home


