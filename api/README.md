# API

The API will be here.

Refer to the [Getting Started Guide](https://api-platform.com/docs/distribution) for more information.

**solve bind permission**
sudo setcap cap_net_bind_service=ep $(which rootlesskit)
systemctl --user restart docker
