### Compatible Node Version

- Node: `16.15.0`
- Npm: `8.5.5`

1. React Native setup
React Native environment setup instructions are documented [here](https://reactnative.dev/docs/environment-setup). Be sure to select the correct React Native version (currently 0.66.x) from the dropdown. This will guide you through setting up your development environment for your operating system and choice of iOS (only if you are using a Mac) or Android. 


2. Clone the ADEYA repo and install its dependencies:

```sh
# Clone GitHub repository:
git clone https://github.com/credebl/adeya-wallet.git

# Go to the ADEYA Wallet directory:
cd adeya-wallet
```

3. Then initialize the bifold submodule:

```sh
# Initialize the aries bifold submodule:
git submodule update --init
```

4. Installing npm modules

install the npm modules from the root of the repository:

```sh
npm install --force
```
Note: the `--force` flag is needed here due to some peer dependencies' versions of bifold being exceeded in ADEYA Wallet

5. Configuration
In the `adeya-wallet/app/` directory add an `.env` file containing:

```
MEDIATOR_URL=https://public.mediator.indiciotech.io?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiMDVlYzM5NDItYTEyOS00YWE3LWEzZDQtYTJmNDgwYzNjZThhIiwgInNlcnZpY2VFbmRwb2ludCI6ICJodHRwczovL3B1YmxpYy5tZWRpYXRvci5pbmRpY2lvdGVjaC5pbyIsICJyZWNpcGllbnRLZXlzIjogWyJDc2dIQVpxSktuWlRmc3h0MmRIR3JjN3U2M3ljeFlEZ25RdEZMeFhpeDIzYiJdLCAibGFiZWwiOiAiSW5kaWNpbyBQdWJsaWMgTWVkaWF0b3IifQ==

```

6. Running in an Android emulator
In the `adeya-wallet/app/` directory 
```
# Open a new terminal session, and run command

npm run android

```

7. Running in an ios device
In the `adeya-wallet/app/ios` directory 
```
# Open a new terminal session, and run command

pod install

# Then go back to the adeya-wallet/app directory and run command

npm run ios

```

- (iOS) Via Xcode: Open `app\ios\AdeyaWallet.xcworkspace`
    Choose your physical iOS device as the destination. Click the "Play" button to Build and Run.
