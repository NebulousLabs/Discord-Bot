import { Message, MessageOptions } from 'discord.js';
import { Command } from 'yamdbf';
import { SweeperClient } from '../util/lib/SweeperClient';

/**
 * Represents possible results of Util#prompt
 */
export enum PromptResult
{
	SUCCESS,
	FAILURE,
	TIMEOUT
}

/**
 * Provide a prompt with simple success/failure expressions that
 * succeeds/fails if the respective expression is matched. Resolves
 * with a tuple containing the PromptResult, as well as the message
 * created by the prompt and the user input message, in case
 * something needs to be done with those two messages
 */
export async function prompt(
	message: Message,
	promptmsg: string,
	success: RegExp,
	failure: RegExp,
	options?: MessageOptions): Promise<[PromptResult, Message, Message]>
{
	const ask: Message = <Message> await message.channel.send(promptmsg, options);
	const confirmation: Message = (await message.channel.awaitMessages(a =>	a.author.id === message.author.id
		&& (success.test(a.content) || failure.test(a.content)), { max: 1, time: 30000 })).first();

	if (!confirmation) return [PromptResult.TIMEOUT, ask, confirmation];
	if (!success.test(confirmation.content)) return [PromptResult.FAILURE, ask, confirmation];
	return [PromptResult.SUCCESS, ask, confirmation];
}

/**
 * Contains the different colors to be used
 * for moderation case logging
 */
export enum CaseTypeColors
{
	'Unban' = 8450847,
	'Warn' = 16776960,
	'Mute' = 16763904,
	'Kick' = 16745216,
	'Softban' = 16745216,
	'Ban' = 16718080
}
