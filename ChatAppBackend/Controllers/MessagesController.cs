
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/messages")]

public class MessagesController : Controller
{
    private readonly MessagesRepository _messagesRepo;

    public MessagesController(MessagesRepository messageRepo)
    {
        _messagesRepo = messageRepo;
    }

    [HttpGet("{all}")]
    public async Task<IActionResult> GetMessagesAsync()
    {
        var messages = await _messagesRepo.GetMessagesAsync();
        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> PostMessageAsync([FromBody] Message message)
    {
        System.Console.WriteLine("request reaching controller");
        await _messagesRepo.AddMessageAsync(message);
        return Ok(new { success = true });
    }
}
