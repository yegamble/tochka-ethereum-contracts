package main

import (
	// "bytes"
	// "context"
	// "crypto/ecdsa"
	// "errors"
	// "fmt"
	"log"
	// "math/big"
	// "strings"
	// "time"
	"encoding/hex"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	// "github.com/ethereum/go-ethereum/common"
	// "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	// "github.com/onrik/ethrpc"

	// "qxklmrhx7qkzais6.onion/Tochka/payaka-payment-gate/apis/etherscan"
	"qxklmrhx7qkzais6.onion/Tochka/tochka-ethereum-contracts/contracts/golang/tochka_escrow_payment"
)

var (
	ethClient *ethclient.Client
)

func init() {
	var err error
	ethClient, err = ethclient.Dial(SETTINGS.EthRPCEndpoint)
	if err != nil {
		log.Fatal(err)
	}
}

func generateKey() (string, string) {
	key, err := crypto.GenerateKey()
	if err != nil {
		log.Fatal(err)
	}
	var (
		address    = crypto.PubkeyToAddress(key.PublicKey)
		publicKey  = "0x" + hex.EncodeToString(address[:])
		privateKey = "0x" + hex.EncodeToString(crypto.FromECDSA(key))
	)

	return publicKey, privateKey
}

func deployTochkaEscrowPaymentContract() {

	privateKey, err := crypto.HexToECDSA(SETTINGS.DeployerWalletPrivateKey[2:])
	if err != nil {
		log.Fatal(err)
	}

	auth := bind.NewKeyedTransactor(privateKey)
	if err != nil {
		log.Fatal(err)
	}
	auth.GasLimit = 1

	address, _, _, err := tochka_escrow_payment.DeployTochkaEscrowPayment(auth, ethClient)
	if err != nil {
		log.Fatal(err)
	}

	println("contract deployed: ", "0x"+hex.EncodeToString(address[:]))

}

func main() {

	gasPrice, err := ethereumAPI.EthGasPrice()
	if err != nil {
		return etx, err
	}

	deployTochkaEscrowPaymentContract()
}
