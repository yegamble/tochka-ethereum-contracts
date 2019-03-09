package main

import (
	"encoding/json"
	"io/ioutil"
	// "os"
)

type Settings struct {
	EthRPCEndpoint           string `json:"ethrcp_endpoint"`
	DeployerWalletPrivateKey string `json:"deployer_private_key"`
}

/*
	Utility Functions
*/

func LoadSettings() Settings {
	var (
		settings Settings
	)

	file, err := ioutil.ReadFile("settings.json")
	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(file, &settings)
	if err != nil {
		panic(err)
	}

	return settings
}

/*
	Globals
*/

var (
	SETTINGS = LoadSettings()
)
