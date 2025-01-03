import type { Role, User } from "@payload-types";
import { actions } from "astro:actions";
import XIcon from "lucide-solid/icons/x";
import { For, Show, Suspense, createResource } from "solid-js";
import { Portal } from "solid-js/web";
import { Bleed, Divider, Flex, HStack, panda } from "styled-system/jsx";
import { button } from "styled-system/recipes/button";
import type { RenderedEvent } from "~/utils/map-events";
import { Button } from "./ui/button";
import { Drawer } from "./ui/drawer";
import { IconButton } from "./ui/icon-button";

type Props = {
  user?: User;

  event?: RenderedEvent;

  open: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
};

export const EventDetailsDrawer = (props: Props) => {
  const [details, { refetch }] = createResource(
    () => props.event?.doc.id,
    async (id) => {
      if (!id) return;
      return await actions.getEventDetails({ id });
    },
  );

  return (
    <Drawer.Root
      open={props.open}
      onOpenChange={({ open }) => {
        !open && props.onClose();
      }}
      onExitComplete={props.onExitComplete}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner width={{ base: "100vw", sm: "xl", md: "2xl" }}>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{props.event?.doc.title}</Drawer.Title>
              <Show when={props.event?.descriptionHtml}>
                <Drawer.Description innerHTML={props.event?.descriptionHtml} />
              </Show>
              <Drawer.CloseTrigger
                position="absolute"
                top="3"
                right="4"
                asChild={(closeProps) => (
                  <IconButton {...closeProps()} variant="ghost" size="lg">
                    <XIcon />
                  </IconButton>
                )}
              />
            </Drawer.Header>
            {/* With suspence the load doesn't propagate to root, removing the flash on first open */}
            <Suspense>
              <Drawer.Body justifyContent="end">
                <panda.h2 fontSize="2xl" fontWeight="semibold" marginBottom="2">
                  Select a role
                </panda.h2>

                <Bleed inline="6">
                  <Divider />
                </Bleed>

                {/* Unsectioned roles */}
                <RoleRows
                  details={details.latest?.data}
                  roles={
                    details.latest?.data?.roles?.docs.filter(
                      (role) => !role.section,
                    ) ?? []
                  }
                  user={props.user}
                  handleRefresh={refetch}
                />

                <For each={details.latest?.data?.sections?.docs}>
                  {(section) => (
                    <panda.div marginTop="8">
                      <panda.h3
                        fontSize="xl"
                        fontWeight="semibold"
                        marginBottom="2"
                      >
                        {section.title}
                      </panda.h3>

                      <Bleed inline="6">
                        <Divider />
                      </Bleed>

                      <RoleRows
                        details={details.latest?.data}
                        roles={section.roles?.docs ?? []}
                        user={props.user}
                        handleRefresh={refetch}
                      />
                    </panda.div>
                  )}
                </For>
              </Drawer.Body>
            </Suspense>
            <Drawer.Footer>
              <Show when={!props.user}>
                <HStack>
                  Want to help out?
                  <a class={button({})} href="/auth/login">
                    Sign in
                  </a>
                  or
                  <a class={button({})} href="/auth/register">
                    Register
                  </a>
                </HStack>
              </Show>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

const RolesNotFoundRow = () => (
  <>
    <panda.p py="4">No roles found :(</panda.p>

    <Bleed inline="6">
      <Divider />
    </Bleed>
  </>
);

type RoleRowsProps = {
  details?: Awaited<ReturnType<typeof actions.getEventDetails>>["data"];
  roles: Role[];
  user?: User;

  handleRefresh: () => void;
};

const RoleRows = (props: RoleRowsProps) => {
  const userSignups = () =>
    props.details?.signups?.docs.filter(
      (signup) => signup.user === props.user?.id,
    );

  const removeEvent = async (id: number) => {
    await actions.deleteSignup({ id });
    props.handleRefresh?.();
  };

  const createSignup = async (event: number, role: number) => {
    await actions.createSignup({ event, role });
    props.handleRefresh?.();
  };

  return (
    <For each={props.roles} fallback={<RolesNotFoundRow />}>
      {(role) => (
        <>
          <Flex py="4" alignItems="center" justifyContent="space-between">
            <panda.div>{role.title}</panda.div>
            <HStack>
              <Show
                when={(() => {
                  const su = userSignups()?.find((su) => su.role === role.id);
                  return su ? su : false;
                })()}
                fallback={
                  <>
                    <p>
                      {props.details?.signups.docs
                        .filter((su) => su.role === role.id)
                        .map((su) => su.title)
                        .join(", ") || "No signups yet"}
                    </p>
                    <Show
                      when={
                        (props.user &&
                          role.maxSignups !== role.signups?.docs?.length) ||
                        role.maxSignups === 0
                      }
                    >
                      <Button
                        variant="solid"
                        size="lg"
                        onClick={() => {
                          if (!props.details?.id)
                            throw new Error("Unexpected, missing event id");

                          createSignup(props.details?.id, role.id);
                        }}
                        _before={{
                          content: '"Signup"',
                          _hover: {
                            content: '"😍 Almost there!"',
                          },
                        }}
                      >
                        <Show when={role.maxSignups > 1}>
                          {` (${role.signups?.docs?.length}/${role.maxSignups})`}
                        </Show>
                      </Button>
                    </Show>
                  </>
                }
              >
                {(su) => (
                  <HStack>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => removeEvent(su().id)}
                      _before={{
                        content: '"🫡 Signed up"',
                        _hover: {
                          content: '"😭 Cancel Signup"',
                        },
                      }}
                    />
                  </HStack>
                )}
              </Show>
            </HStack>
          </Flex>
          <Bleed inline="6">
            <Divider />
          </Bleed>
        </>
      )}
    </For>
  );
};
