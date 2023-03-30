# NullController

## Summary
NullController is a Managed Pool Controller that has no ability to issue commands to the Managed Pool. The NullController exists to be a bare minimum framework on top of which other controllers can be built. NullControllerFactory demonstrates a factory that can deploy both a Managed Pool and a controller that are both aware of each other without using a separate `initialize()` function.

## Details
If the NullController did anything interesting, this is where an explanation of what it can do and how it does it would be found. Since the NullController does nothing, the Managed Pool effectively becomes a Weighted Pool.

## Access Control
### NullController
The controller itself does not implement any access control because it can take no actions. Other controllers may want to guard functions. Some potential access control paradigms include but are not limited to:
- Public execution (no access control)
- Direct manager control
- Timelocked manager control
- Timelocked manager control and a guardian with the ability to veto

### NullControllerFactory
The factory has one permissioned function: `disable()`. Using OZ's Ownable, the factory restricts permission to only the contract `owner`. Ownable was chosen as it is a very simple concept that requires little explanation; however, it may be desirable to grant this permission to more than a single `owner`. Using a solution such as Balancer's [SingletonAuthentication](https://github.com/balancer/balancer-v2-monorepo/blob/3e99500640449585e8da20d50687376bcf70462f/pkg/solidity-utils/contracts/helpers/SingletonAuthentication.sol) could be a useful system for many controller factories.

## Managed Pool Functions
The following list is a list of permissioned functions in a Managed Pool that a controller could potentially call. The NullController can call the functions below that are denoted with a checked box:

- Gradual Updates
	- [ ] `pool.updateSwapFeeGradually(...)`
	- [ ] `pool.updateWeightsGradually(...)`
- Enable/Disable Interactions
	- [ ] `pool.setSwapEnabled(...)`
	- [ ] `pool.setJoinExitEnabled(...)`
- LP Allowlist Management
	- [ ] `pool.setMustAllowlistLPs(...)`
	- [ ] `pool.addAllowedAddress(...)`
	- [ ] `pool.removeAllowedAddress(...)`
- Add/Remove Token
	- [ ] `pool.addToken(...)`
	- [ ] `pool.removeToken(...)`
- Circuit Breaker Management
	- [ ] `pool.setCircuitBreakers(...)`
- Management Fee
	- [ ] `pool.setManagementAumFeePercentage(...)`
