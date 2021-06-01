
import { Client } from "discord.js";
import fetch from "node-fetch";
import { Interaction, InteractionApplicationCommandCallbackData, InteractionResponse } from "./discord_type_extension";







export async function respondToInteraction(
    client: Client,
    interaction: Interaction,
    response: InteractionResponse
  ) {
    var url = "https://discord.com/api/v8/interactions";
    url += `/${interaction.id}`;
    url += `/${interaction.token}`;
    url += "/callback";
    var res = await fetch(url, {
      headers: {
        Authorization: `Bot ${client.token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(response),
    });
    await res.text();
    console.log(
      `Responding to interaction with id ${interaction.id}\nGot status ${res.status} ${res.statusText}`
    );
  }

  


export async function patchInteraction(
    client: Client,
    interaction: Interaction,
    response: InteractionApplicationCommandCallbackData
  ) {
    var url = "https://discord.com/api/v8/webhooks";
    url += `/${client.user!.id}`;
    url += `/${interaction.token}`;
    url += "/messages/@original";
    var res = await fetch(url, {
      headers: {
        Authorization: `Bot ${client.token}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(response),
    });
    await res.text();
    console.log(
      `Patching interaction with id ${interaction.id}\nGot status ${res.status} ${res.statusText}`
    );
  }
  