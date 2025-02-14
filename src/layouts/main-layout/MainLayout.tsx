import { Button, Group, Menu, Stack } from "@mantine/core";

import { Outlet, useParams } from "react-router";
import { MapComponent } from "../../components/map";
import { Categories } from "../../components/categories";

export default function MainLayout() {
  const params = useParams()
  console.log(Object.keys(params));
  
  return (
    <>
      <header className="relative">
        <nav style={{background : '#fff', height : '60px'}}>
<h1>Jadiger</h1>
        </nav>
        <Group
          px={20}
          gap={10}
          style={{
            height: "40px",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            transform: "translateY(  calc(100% + 20px))",
            zIndex: 100,
          }}
          wrap="nowrap"
          align="flex-start"
          color="none"
        >
          <div style={{ flexShrink: 0 }}>
            <Menu width={250} shadow="md">
              <Menu.Target>
                <Button>All Categories</Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>
                  <Stack style={{ maxHeight: "400px", overflowY: "scroll" }}>
                    <Categories />
                  </Stack>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
          <Group gap={10} style={{ height: "100%", overflowY: "hidden" }}>
            <Categories />
          </Group>
        </Group>
      </header>

      <MapComponent />
       <Outlet/>
    </>
  );
}
