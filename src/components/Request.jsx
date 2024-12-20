import algosdk,{ AtomicTransactionComposer, OnApplicationComplete } from "algosdk";
import { Buffer } from 'buffer';
import appspec from '../application.json'



async function ski() {
const baseServer = 'https://testnet-api.algonode.cloud'
const port = '';
const token = {
}
const algodclient = new algosdk.Algodv2(token, baseServer, port);
const suggestedParams = await algodclient.getTransactionParams().do();
const userMnemonic = "brick game afraid initial planet choose admit despair boost final excess sentence delay equal student regular lamp under immense shock divert kingdom brick absorb join";
const userAccout =  algosdk.mnemonicToSecretKey(userMnemonic);
const contract = new algosdk.ABIContract(appspec.contract);
const signer = algosdk.makeBasicAccountTransactionSigner(userAccout);

const atc = new algosdk.AtomicTransactionComposer();
atc.addMethodCall({
    appID:480211975,
    method:algosdk.getMethodByName(contract.methods, 'add_request_hash'),
    methodArgs: ["1st hash"],
    sender: "HBJ6DJ3LIMBXLI4N3OJC23WROFE2BPOOPF4SIC6OEYRFTE6O5R5TJYHOUQ",
    suggestedParams:suggestedParams,
    signer: signer,
    onComplete: OnApplicationComplete.NoOpOC
})
console.log(atc);

console.log(atc.execute(algodclient,4))

}

function Request(){
    ski();
    return (<h1>test</h1>);
}

export default Request;
