'use strict';

import { GuildMember, Message, Role } from 'discord.js';

export default class Assignment
{
	public static existsInArray(array: Array<any>, item: string): boolean
	{
		if (array === undefined) return false;
		return Boolean(array.find(a => a.name === item));
	}

	public static isSpecificResult(array: Array<any>, item: string): boolean
	{
		if (array === undefined) return false;
		return Boolean(array.find(a => a.string === item));
	}

	public static doesRoleExist(array: Array<any>, item: Role): boolean
	{
		if (array === undefined) return false;
		return Boolean(array.find(a => a.id === item.id));
	}

	public static getSpecificRole(array: Array<any>, item: string): Role
	{
		return array.find(a => a.string === item).original[1];
	}

	public static getSpecificRoleName(array: Array<any>, item: string): string
	{
		return array.find(a => a.string === item).original.name;
	}

	public static getRoleToRemove(array: Array<any>, item: string): number
	{
		return array.findIndex(a => a.name === item);
	}

	public static updateRoles(availableRoles: any, guildStorage: any, role: Role): void
	{
		if (availableRoles === undefined)
		{
			let newAvailableRoles: Array<any> = [{ 'id': role.id, 'name': role.name }];
			guildStorage.set('Server Roles', newAvailableRoles);
		}
		else
		{
			availableRoles.push({ 'id': role.id, 'name': role.name });
			guildStorage.set('Server Roles', availableRoles);
		}
	}

	public static removeRoleFromUserBase(message: Message, role: Role): Promise<Message>
	{
		let count: number = 0;
		message.guild.members.forEach((user: GuildMember) => {
			if (user.roles.find('name', role.name))
			{
				user.removeRole(role);
				count++;
			}
		});
		return message.channel.sendMessage(`\`${role.name}\` successfully disallowed and removed from \`${count}\` users.`);
	}
}
