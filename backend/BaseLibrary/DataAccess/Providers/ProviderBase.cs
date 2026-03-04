using Filmograf.BaseLibrary.DataAccess.DbContext;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Types;
using Microsoft.EntityFrameworkCore;

namespace Filmograf.BaseLibrary.DataAccess.Providers;

public abstract class ProviderBase<BType> where BType : TypeBase
{
    protected readonly DbContextBase _contextBase;
    
    protected ProviderBase(DbContextBase contextBase)
    {
        _contextBase = contextBase;
    }
    
    /// <summary>
    /// Верет DbSet для сущности данного провайдера
    /// </summary>
    /// <param name="contextBase">Инстанция соединения с бд</param>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    protected DbSet<BType> GetDbSet()
    {
        return _contextBase.GetDbSet(typeof(BType)) as DbSet<BType> ??
               throw new InvalidOperationException("!!!");
    }

    /// <summary>
    /// Получает все сущности типа <typeparamref name="BType"/> из БД.
    /// </summary>
    /// <returns>Коллекция сущностей.</returns>
    public virtual IEnumerable<BType> ListAll()
    {
        return GetDbSet().ToList();
    }
    public virtual async Task<IEnumerable<BType>> ListAllAsync()
    {
        return await GetDbSet().ToListAsync();
    }

    /// <summary>
    /// Проверяет существование сущности с указанным ID.
    /// </summary>
    /// <param name="id">Идентификатор сущности.</param>
    /// <returns>True, если сущность существует, иначе False.</returns>
    public virtual bool Has(Guid id)
    {
        return Get(id) != null;
    }
    public virtual async Task<bool> HasAsync(Guid id)
    {
        return await GetAsync(id) != null;
    }

    /// <summary>
    /// Получает сущность по ID.
    /// </summary>
    /// <param name="id">Идентификатор сущности.</param>
    /// <returns>Найденная сущность или null.</returns>
    public virtual BType? Get(Guid id)
    {
        return GetDbSet()
            .FirstOrDefault(item => item.Id == id);
    }
    public virtual async Task<BType?> GetAsync(Guid id)
    {
        return await GetDbSet()
            .FirstOrDefaultAsync(item => item.Id == id);
    }


    public virtual async Task<IEnumerable<BType>> GetByIdsAsync(Guid[] ids)
    {
        return await GetDbSet()
            .Where(i => ids.Contains(i.Id))
            .ToListAsync();
    }


    /// <summary>
    /// Добавляет новую сущность в БД.
    /// </summary>
    /// <param name="item">Добавляемая сущность.</param>
    /// <returns>Добавленная сущность (с заполненным ID).</returns>
    public virtual BType? Add(BType item)
    {
        var dbSet = GetDbSet();
        var newEntity = dbSet.Add(item).Entity;

        _contextBase.SaveChanges();

        return newEntity;
    }
    public virtual async Task<BType?> AddAsync(BType item)
    {
        var dbSet = GetDbSet();
        var newEntity = (await dbSet.AddAsync(item)).Entity;

        await _contextBase.SaveChangesAsync();

        return newEntity;
    }

    public virtual IEnumerable<BType> AddMany(IEnumerable<BType> items)
    {
        List<BType> outputValues = new List<BType>();
        var dbSet = GetDbSet();

        foreach (BType item in items)
            outputValues.Add(dbSet.Add(item).Entity);

        _contextBase.SaveChanges();
        return outputValues;
    }
    public virtual async Task<IEnumerable<BType>> AddManyAsync(IEnumerable<BType> items)
    {
        List<BType> outputValues = new List<BType>();
        var dbSet = GetDbSet();

        foreach (BType item in items)
            outputValues.Add((await dbSet.AddAsync(item)).Entity);

        await _contextBase.SaveChangesAsync();
        return outputValues;
    }

    /// <summary>
    /// Удаляет сущность по ID.
    /// </summary>
    /// <param name="id">Идентификатор сущности.</param>
    /// <returns>True, если удаление прошло успешно, иначе False.</returns>
    public virtual bool Delete(Guid id)
    {
        var dbSet = GetDbSet();
        return dbSet
            .Where(i => i.Id == id)
            .ExecuteDelete() > 0;
    }
    public virtual async Task<bool> DeleteAsync(Guid id)
    {
        var dbSet = GetDbSet();
        return await dbSet
            .Where(i => i.Id == id)
            .ExecuteDeleteAsync() > 0;
    }

    public async Task DeleteManyAsync(Guid[] ids)
    {
        var dbSet = GetDbSet();

        await dbSet.Where(i => ids.Contains(i.Id))
            .ExecuteDeleteAsync();
    }

    public virtual bool Update(Guid id, BType updateStatement)
    {
        var dbSet = GetDbSet();
        var exitingEntity = dbSet.FirstOrDefault(i => i.Id == id);
        if (exitingEntity == null) return false;
        
        updateStatement.Id = id;
        _contextBase.Entry(exitingEntity).CurrentValues.SetValues(updateStatement);
        _contextBase.SaveChanges();
        return true;
    }
    public virtual async Task<bool> UpdateAsync(Guid id, BType updateStatement)
    {
        var dbSet = GetDbSet();
        var exitingEntity = await dbSet.FirstOrDefaultAsync(i => i.Id == id);
        if (exitingEntity == null) return false;
        
        updateStatement.Id = id;
        _contextBase.Entry(exitingEntity).CurrentValues.SetValues(updateStatement);
        await _contextBase.SaveChangesAsync();
        return true;
    }
}