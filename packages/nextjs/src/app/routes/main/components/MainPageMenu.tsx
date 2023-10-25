import React, { FC } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

export interface IMainPageMenuProps {
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
}

export const MainPageMenu: FC<IMainPageMenuProps> = props => (
  <Menu
    style={{
      textAlign: "center",
      justifyContent: "center",
    }}
    selectedKeys={[props.route]}
    mode="horizontal"
  >
    <Menu.Item key="/">
      <Link
        onClick={() => {
          props.setRoute("/");
        }}
        to="/"
      >
        Multi Sign
      </Link>
    </Menu.Item>
    <Menu.Item key="/owners">
      <Link
        onClick={() => {
          props.setRoute("/owners");
        }}
        to="/owners"
      >
        Owners
      </Link>
    </Menu.Item>
    <Menu.Item key="/create">
      <Link
        onClick={() => {
          props.setRoute("/create");
        }}
        to="/create"
      >
        Create
      </Link>
    </Menu.Item>
    <Menu.Item key="/pool">
      <Link
        onClick={() => {
          props.setRoute("/pool");
        }}
        to="/pool"
      >
        Pool
      </Link>
    </Menu.Item>
    <Menu.Item key="/debug">
      <Link
        onClick={() => {
          props.setRoute("/debug");
        }}
        to="/debug"
      >
        Debug
      </Link>
    </Menu.Item>
    <Menu.Item key="/hints">
      <Link
        onClick={() => {
          props.setRoute("/hints");
        }}
        to="/hints"
      >
        Hints
      </Link>
    </Menu.Item>
    {/* <Menu.Item key="/mainnetdai">
      <Link
        onClick={() => {
          props.setRoute('/mainnetdai');
        }}
        to="/mainnetdai">
        Mainnet DAI
      </Link>
    </Menu.Item>
    <Menu.Item key="/subgraph">
      <Link
        onClick={() => {
          props.setRoute('/subgraph');
        }}
        to="/subgraph">
        Subgraph
      </Link>
    </Menu.Item> */}
  </Menu>
);
