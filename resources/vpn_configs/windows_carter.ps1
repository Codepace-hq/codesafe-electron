
function AddAlgoVPN {
  certutil -f -importpfx .\carter.p12
  Add-VpnConnection -name "Codesafe VPN by Codepace" -ServerAddress "34.234.106.106" -TunnelType IKEv2 -AuthenticationMethod MachineCertificate -EncryptionLevel Required
  Set-VpnConnectionIPsecConfiguration -ConnectionName "Codesafe VPN by Codepace" -AuthenticationTransformConstants GCMAES128 -CipherTransformConstants GCMAES128 -EncryptionMethod AES128 -IntegrityCheckMethod SHA384 -DHGroup ECP256 -PfsGroup ECP256  -Force
}

function RemoveAlgoVPN {
  Get-ChildItem cert:LocalMachine/Root | Where-Object { $_.Subject -match '^CN=34.234.106.106$' -and $_.Issuer -match '^CN=34.234.106.106$' } | Remove-Item
  Get-ChildItem cert:LocalMachine/My | Where-Object { $_.Subject -match '^CN=carter$' -and $_.Issuer -match '^CN=34.234.106.106$' } | Remove-Item
  Remove-VpnConnection -name "Codesafe VPN by Codepace" -Force
}

switch ($args[0]) {
  "Add" { AddAlgoVPN }
  "Remove" { RemoveAlgoVPN }
  default { Write-Host Usage: $MyInvocation.MyCommand.Name "(Add|Remove)" }
}
