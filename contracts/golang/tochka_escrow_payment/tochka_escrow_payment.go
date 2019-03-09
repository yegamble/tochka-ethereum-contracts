// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package tochka_escrow_payment

import (
	"math/big"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

// TochkaEscrowPaymentABI is the input ABI used to generate the binding from.
const TochkaEscrowPaymentABI = "[{\"constant\":false,\"inputs\":[{\"name\":\"_contributors\",\"type\":\"address[]\"},{\"name\":\"_percents\",\"type\":\"uint256[]\"}],\"name\":\"mulitransfer\",\"outputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"}]"

// TochkaEscrowPaymentBin is the compiled bytecode used for deploying new contracts.
const TochkaEscrowPaymentBin = `0x6060604052341561000f57600080fd5b6101aa8061001e6000396000f3006060604052600436106100405763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663474cdfca8114610045575b600080fd5b6100646024600480358281019290820135918135918201910135610066565b005b3460008080831161007657600080fd5b8584111561008357600080fd5b5060009050805b858210156101755760648585848181106100a057fe5b90506020020135111515156100b457600080fd5b60008585848181106100c257fe5b90506020020135101515156100d657600080fd5b60648585848181106100e457fe5b9050602002013584028115156100f657fe5b049050600081111561016a5786868381811061010e57fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151561016a57600080fd5b60019091019061008a565b505050505050505600a165627a7a72305820e923088737f54e9507cff290493968db8822030881d55d24fab7a8779a1a42ea0029`

// DeployTochkaEscrowPayment deploys a new Ethereum contract, binding an instance of TochkaEscrowPayment to it.
func DeployTochkaEscrowPayment(auth *bind.TransactOpts, backend bind.ContractBackend) (common.Address, *types.Transaction, *TochkaEscrowPayment, error) {
	parsed, err := abi.JSON(strings.NewReader(TochkaEscrowPaymentABI))
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	address, tx, contract, err := bind.DeployContract(auth, parsed, common.FromHex(TochkaEscrowPaymentBin), backend)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &TochkaEscrowPayment{TochkaEscrowPaymentCaller: TochkaEscrowPaymentCaller{contract: contract}, TochkaEscrowPaymentTransactor: TochkaEscrowPaymentTransactor{contract: contract}, TochkaEscrowPaymentFilterer: TochkaEscrowPaymentFilterer{contract: contract}}, nil
}

// TochkaEscrowPayment is an auto generated Go binding around an Ethereum contract.
type TochkaEscrowPayment struct {
	TochkaEscrowPaymentCaller     // Read-only binding to the contract
	TochkaEscrowPaymentTransactor // Write-only binding to the contract
	TochkaEscrowPaymentFilterer   // Log filterer for contract events
}

// TochkaEscrowPaymentCaller is an auto generated read-only Go binding around an Ethereum contract.
type TochkaEscrowPaymentCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TochkaEscrowPaymentTransactor is an auto generated write-only Go binding around an Ethereum contract.
type TochkaEscrowPaymentTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TochkaEscrowPaymentFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type TochkaEscrowPaymentFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TochkaEscrowPaymentSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type TochkaEscrowPaymentSession struct {
	Contract     *TochkaEscrowPayment // Generic contract binding to set the session for
	CallOpts     bind.CallOpts        // Call options to use throughout this session
	TransactOpts bind.TransactOpts    // Transaction auth options to use throughout this session
}

// TochkaEscrowPaymentCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type TochkaEscrowPaymentCallerSession struct {
	Contract *TochkaEscrowPaymentCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts              // Call options to use throughout this session
}

// TochkaEscrowPaymentTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type TochkaEscrowPaymentTransactorSession struct {
	Contract     *TochkaEscrowPaymentTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts              // Transaction auth options to use throughout this session
}

// TochkaEscrowPaymentRaw is an auto generated low-level Go binding around an Ethereum contract.
type TochkaEscrowPaymentRaw struct {
	Contract *TochkaEscrowPayment // Generic contract binding to access the raw methods on
}

// TochkaEscrowPaymentCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type TochkaEscrowPaymentCallerRaw struct {
	Contract *TochkaEscrowPaymentCaller // Generic read-only contract binding to access the raw methods on
}

// TochkaEscrowPaymentTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type TochkaEscrowPaymentTransactorRaw struct {
	Contract *TochkaEscrowPaymentTransactor // Generic write-only contract binding to access the raw methods on
}

// NewTochkaEscrowPayment creates a new instance of TochkaEscrowPayment, bound to a specific deployed contract.
func NewTochkaEscrowPayment(address common.Address, backend bind.ContractBackend) (*TochkaEscrowPayment, error) {
	contract, err := bindTochkaEscrowPayment(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &TochkaEscrowPayment{TochkaEscrowPaymentCaller: TochkaEscrowPaymentCaller{contract: contract}, TochkaEscrowPaymentTransactor: TochkaEscrowPaymentTransactor{contract: contract}, TochkaEscrowPaymentFilterer: TochkaEscrowPaymentFilterer{contract: contract}}, nil
}

// NewTochkaEscrowPaymentCaller creates a new read-only instance of TochkaEscrowPayment, bound to a specific deployed contract.
func NewTochkaEscrowPaymentCaller(address common.Address, caller bind.ContractCaller) (*TochkaEscrowPaymentCaller, error) {
	contract, err := bindTochkaEscrowPayment(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &TochkaEscrowPaymentCaller{contract: contract}, nil
}

// NewTochkaEscrowPaymentTransactor creates a new write-only instance of TochkaEscrowPayment, bound to a specific deployed contract.
func NewTochkaEscrowPaymentTransactor(address common.Address, transactor bind.ContractTransactor) (*TochkaEscrowPaymentTransactor, error) {
	contract, err := bindTochkaEscrowPayment(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &TochkaEscrowPaymentTransactor{contract: contract}, nil
}

// NewTochkaEscrowPaymentFilterer creates a new log filterer instance of TochkaEscrowPayment, bound to a specific deployed contract.
func NewTochkaEscrowPaymentFilterer(address common.Address, filterer bind.ContractFilterer) (*TochkaEscrowPaymentFilterer, error) {
	contract, err := bindTochkaEscrowPayment(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &TochkaEscrowPaymentFilterer{contract: contract}, nil
}

// bindTochkaEscrowPayment binds a generic wrapper to an already deployed contract.
func bindTochkaEscrowPayment(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(TochkaEscrowPaymentABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_TochkaEscrowPayment *TochkaEscrowPaymentRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _TochkaEscrowPayment.Contract.TochkaEscrowPaymentCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_TochkaEscrowPayment *TochkaEscrowPaymentRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TochkaEscrowPayment.Contract.TochkaEscrowPaymentTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_TochkaEscrowPayment *TochkaEscrowPaymentRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _TochkaEscrowPayment.Contract.TochkaEscrowPaymentTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_TochkaEscrowPayment *TochkaEscrowPaymentCallerRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _TochkaEscrowPayment.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_TochkaEscrowPayment *TochkaEscrowPaymentTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TochkaEscrowPayment.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_TochkaEscrowPayment *TochkaEscrowPaymentTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _TochkaEscrowPayment.Contract.contract.Transact(opts, method, params...)
}

// Mulitransfer is a paid mutator transaction binding the contract method 0x474cdfca.
//
// Solidity: function mulitransfer(_contributors address[], _percents uint256[]) returns()
func (_TochkaEscrowPayment *TochkaEscrowPaymentTransactor) Mulitransfer(opts *bind.TransactOpts, _contributors []common.Address, _percents []*big.Int) (*types.Transaction, error) {
	return _TochkaEscrowPayment.contract.Transact(opts, "mulitransfer", _contributors, _percents)
}

// Mulitransfer is a paid mutator transaction binding the contract method 0x474cdfca.
//
// Solidity: function mulitransfer(_contributors address[], _percents uint256[]) returns()
func (_TochkaEscrowPayment *TochkaEscrowPaymentSession) Mulitransfer(_contributors []common.Address, _percents []*big.Int) (*types.Transaction, error) {
	return _TochkaEscrowPayment.Contract.Mulitransfer(&_TochkaEscrowPayment.TransactOpts, _contributors, _percents)
}

// Mulitransfer is a paid mutator transaction binding the contract method 0x474cdfca.
//
// Solidity: function mulitransfer(_contributors address[], _percents uint256[]) returns()
func (_TochkaEscrowPayment *TochkaEscrowPaymentTransactorSession) Mulitransfer(_contributors []common.Address, _percents []*big.Int) (*types.Transaction, error) {
	return _TochkaEscrowPayment.Contract.Mulitransfer(&_TochkaEscrowPayment.TransactOpts, _contributors, _percents)
}
