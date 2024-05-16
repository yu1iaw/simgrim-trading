import * as DropdownMenu from 'zeego/dropdown-menu';
import { RoundedButton } from './RoundedButton';


export const Dropdown = () => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <RoundedButton icon="ellipsis-horizontal" text="More" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item key='statement'>
                    <DropdownMenu.ItemTitle>Statement</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon
                        ios={{
                            name: "list.bullet.rectangle.fill",
                            pointSize: 24
                        }}
                        androidIconName="ic_menu_compass"
                    />
                </DropdownMenu.Item>
                <DropdownMenu.Item key='converter'>
                    <DropdownMenu.ItemTitle>Converter</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon
                        ios={{
                            name: "coloncurrencysign.arrow.circlepath",
                            pointSize: 24
                        }}
                        androidIconName="ic_menu_rotate"
                    />
                </DropdownMenu.Item>
                <DropdownMenu.Item key='background'>
                    <DropdownMenu.ItemTitle>Background</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon
                        ios={{
                            name: "photo.fill",
                            pointSize: 24
                        }}
                        androidIconName="ic_menu_crop"
                    />
                </DropdownMenu.Item>
                <DropdownMenu.Item key='account'>
                    <DropdownMenu.ItemTitle>Add new account</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon
                        ios={{
                            name: "plus.rectangle.on.folder.fill",
                            pointSize: 24
                        }}
                        androidIconName="ic_menu_add"
                    />
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}